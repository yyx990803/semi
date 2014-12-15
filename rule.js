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
		var lastToken = context.getLastToken(node),
			nextToken = context.getTokenAfter(node)

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

				context.report(node, node.loc.end, "REMOVE")
				// handle next token speical case
				if (isSpecialNewLine) {
					context.report(nextToken, nextToken.loc.start, "ADD")
				}

			}
		}
	}

	/**
	 * Checks to see if there's a semicolon after a variable declaration.
	 * @param {ASTNode} node The node to check.
	 * @returns {void}
	 */
	function checkForSemicolonForVariableDeclaration(node) {

		var ancestors = context.getAncestors(),
			parentIndex = ancestors.length - 1,
			parent = ancestors[parentIndex]

		if ((parent.type !== "ForStatement" || parent.init !== node) &&
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
			var nextToken
			context.report(node, node.loc.end, "REMOVE")
			if (!always) {
				nextToken = context.getTokenAfter(node) || context.getLastToken(node)
				// handle next token speical case
				if (OPT_OUT_PATTERN.test(nextToken.value)) {
					context.report(nextToken, nextToken.loc.start, "ADD")
				}
			}


		}
	}

}
