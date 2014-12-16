/**
 * @fileoverview Rule to insert/remove semicolons, based on the original ESLint
 *               semi rule.
 *
 * @author Nicholas C. Zakas
 * @author Evan You
 */
"use strict"

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {

  var OPT_OUT_PATTERN = /[\[\(\/\+\-]/

  var always = context.options[0] !== "never"

  var emptyStatementParentTypes = {
    IfStatement: true,
    WhileStatement: true,
    ForStatement: true,
    ForInStatement: true
  }

  //----------------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------------
  
  /**
   * Check if two tokens are on different lines.
   *
   * @param {Token} last
   * @param {Token} next
   */
  function isOnNewLine (last, next) {
    var lastTokenLine = last.loc.end.line
    var nextTokenLine = next && next.loc.start.line
    return lastTokenLine !== nextTokenLine
  }

  /**
   * Check if a semicolon is removable. We should only remove the semicolon if:
   *   - next token is a statement divider ("}" or ";")
   *   - next token is on a new line
   *
   * @param {Token} last
   * @param {Token} next
   */
  function isRemovable (last, next) {
    var isDivider = next && (next.value === '}' || next.value === ';')
    return isDivider || isOnNewLine(last, next)
  }

  /**
   * Checks a node to see if it's followed by a semicolon.
   *
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolon(node) {

    var lastToken = context.getLastToken(node)
    var nextToken = context.getTokenAfter(node)
    var isSpecialNewLine = nextToken && OPT_OUT_PATTERN.test(nextToken.value)

    if (always) {
      var added = false
      if (lastToken.type !== "Punctuator" || lastToken.value !== ";") {
        context.report(node, lastToken.loc.end, "ADD")
        added = true
      }
      if (isSpecialNewLine) {
        if (lastToken.value === ';') {
          context.report(node, lastToken.loc.end, "REMOVE")
          lastToken = context.getLastToken(node, 1)
        }
        if (!added) {
          context.report(node, lastToken.loc.end, "ADD")
        }
      }
    } else {
      if (
        lastToken.type === "Punctuator" &&
        lastToken.value === ";" &&
        isRemovable(lastToken, nextToken)
      ) {
        context.report(node, node.loc.end, "REMOVE")
      }
      // handle next token speical case
      if (isSpecialNewLine) {
        context.report(nextToken, nextToken.loc.start, "ADD")
      }
    }
  }

  /**
   * Checks to see if there's a semicolon after a variable declaration.
   *
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolonForVariableDeclaration(node) {

    var ancestors = context.getAncestors()
    var parentIndex = ancestors.length - 1
    var parent = ancestors[parentIndex]

    if (
      (parent.type !== "ForStatement" || parent.init !== node) &&
      (parent.type !== "ForInStatement" || parent.left !== node)
    ) {
      checkForSemicolon(node)
    }
  }

  //--------------------------------------------------------------------------
  // Public API
  //--------------------------------------------------------------------------

  return {

    "VariableDeclaration": checkForSemicolonForVariableDeclaration,
    "ExpressionStatement": checkForSemicolon,
    "ReturnStatement": checkForSemicolon,
    "DebuggerStatement": checkForSemicolon,
    "BreakStatement": checkForSemicolon,
    "ContinueStatement": checkForSemicolon,
    "DoWhileStatement": checkForSemicolon,
    "EmptyStatement": function (node) {
      console.log(123)
      var lastToken = context.getLastToken(node)
      var nextToken = context.getTokenAfter(node) || context.getLastToken(node)
      var isSpecialNewLine = OPT_OUT_PATTERN.test(nextToken.value)

      if (
        isRemovable(lastToken, nextToken) &&
        !emptyStatementParentTypes[node.parent.type]
      ) {
        context.report(node, node.loc.end, "REMOVE")
        if (!always && isSpecialNewLine) {
          context.report(nextToken, nextToken.loc.start, "ADD")
        }
      }
    }
  }

}
