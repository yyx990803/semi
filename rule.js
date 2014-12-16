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

  //--------------------------------------------------------------------------
  // Helpers
  //--------------------------------------------------------------------------

  /**
   * Checks a node to see if it's followed by a semicolon.
   * @param {ASTNode} node The node to check.
   * @returns {void}
   */
  function checkForSemicolon(node) {

    var lastToken = context.getLastToken(node)
    var nextToken = context.getTokenAfter(node)
    var isSpecialNewLine = nextToken && OPT_OUT_PATTERN.test(nextToken.value)

    if (always) {
      if (lastToken.type !== "Punctuator" || lastToken.value !== ";") {
        context.report(node, lastToken.loc.end, "ADD")
      }
      if (isSpecialNewLine) {
        if (lastToken.value === ';') {
          context.report(node, lastToken.loc.end, "REMOVE")
        }
        var beforeLast = context.getLastToken(node, 1)
        context.report(node, beforeLast.loc.end, "ADD")
      }

    } else {
      if (lastToken.type === "Punctuator" && lastToken.value === ";") {
        // Only remove semicolon if next token is on a new line, or if
        // it is an empty statement. This was a bug in ESLint.
        if (isRemovable(lastToken, nextToken)) {
          context.report(node, node.loc.end, "REMOVE")
          // handle next token speical case
          if (isSpecialNewLine) {
            context.report(nextToken, nextToken.loc.start, "ADD")
          }
        }
      }
    }
  }

  /**
   * Check if a semicolon is removable. We should only remove the semicolon if:
   *   - next token is on a new line
   *   - next token is on the same line but is a punctuator
   * @param {Token} last
   * @param {Token} next
   */
  function isRemovable (last, next) {
    var lastTokenLine = last.loc.end.line
    var nextTokenLine = next && next.loc.start.line
    var isPunctuator = next && (next.value === '}' || next.value === ';')
    return isPunctuator || (lastTokenLine !== nextTokenLine)
  }

  /**
   * Checks to see if there's a semicolon after a variable declaration.
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
    "EmptyStatement": function (node) {

      var lastToken = context.getLastToken(node)
      var nextToken = context.getTokenAfter(node) || context.getLastToken(node)
      var isSpecialNewLine = OPT_OUT_PATTERN.test(nextToken.value)

      if (isRemovable(lastToken, nextToken)) {
        context.report(node, node.loc.end, "REMOVE")
        if (!always && isSpecialNewLine) {
          context.report(nextToken, nextToken.loc.start, "ADD")
        }
      }
    }
  }

}
