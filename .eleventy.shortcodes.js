const markdownIt = require("markdown-it");
const markdownItAnchor = require('markdown-it-anchor');
const fsExtra = require("fs-extra");
const path = require("path");

module.exports = config => {
	const md = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor);
	config.setLibrary("md", md);


	// MD in NJK
	config.addPairedShortcode("md", (content) => {
		return md.render(content.replace(/^\s+/gm, ''));
	});


	// Wrapper for project sections
	config.addPairedShortcode("projectSection", function(content) {
		// Convert tabs to spaces while preserving relative indentation
		const cleanedContent = content.replace(/^(\t+)/gm, (match, tabs) => '  '.repeat(tabs.length));
		const renderedContent = md.render(cleanedContent);
		
		return `<div class="project-section">
			<div class="container --project">${renderedContent}</div>
		</div>`;
	});

	// Emphasize text block
	config.addPairedShortcode("callout", function(content) {
		// Convert tabs to spaces while preserving relative indentation
		const cleanedContent = content.replace(/^(\t+)/gm, (match, tabs) => '  '.repeat(tabs.length));
		const renderedContent = md.render(cleanedContent);

		return `<div class="callout">${renderedContent}</div>`;
	});

	// Impact in a case study
	config.addShortcode("impact", function(name, valueOld, valueNew, goodOrBad, goal) {
		let goalHTML = ''
		let nameHTML = ''
		let valueOldHTML = ''

		if (valueOld) {
			valueOldHTML = `<span class="impact__oneValue">${valueOld}</span> → `
		}
		if (goal) {
			goalHTML = `<div class="impact__goal">Goal: ${goal}</div>`
		}
		if (name) {
			nameHTML = `<div class="impact__name">${name}</div>`
		}

		return `<div class="impact --${goodOrBad}">
				<div class="impact__values">
					${valueOldHTML}<span class="impact__oneValue">${valueNew}</span>
				</div>
				${goalHTML}${nameHTML}
			</div>`;
	});
	config.addPairedShortcode("ImpactRow", function(content) {
		return `<div class="impactRow">${content}</div>`;
	});

	// emphasize inline values
	config.addShortcode("highlightValue", function(val, classname) {
		return `<span class="highlightValue --${classname}">${val}</span>`;
	});

	config.addPairedShortcode("highlight", function(content) {
		return `<b class="project-section__highlights">${content}</b>`;
	  });

	// currentYear
	config.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

	// Projects
	config.addPairedShortcode("projectColumn", function(content) {
		return `
			<div class="project-body__column">
				${content}
			</div>
			`;
	});


	config.addPairedShortcode("skill", async function(content, name) {
		return `
		<div class="skill">
			<div class="skill__text">
				<h4 class="skill__name">${name}</h4>
				<div class="skill__desc">${content}</div>
			</div>
		</div>`;
	});
	

	  
}