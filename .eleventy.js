const Image = require("@11ty/eleventy-img");
const navigationPlugin = require('@11ty/eleventy-navigation');
const yaml = require("js-yaml");

module.exports = function(config) {
	config.addDataExtension("yaml", contents => yaml.load(contents));
	config.addPassthroughCopy("src/fonts");
	config.addPassthroughCopy("src/scripts");
	config.addPassthroughCopy( "src/assets/**/*");
	config.addPassthroughCopy("src/*.txt");
	config.addPassthroughCopy("src/manifest.json");
	config.addWatchTarget("./src/styles/**/*.styl");
	config.addNunjucksAsyncShortcode("image", imageShortcode);
	//config.addPlugin(navigationPlugin);

	//////////// Shortcodes
	config.addShortcode("currentYear", () => `${new Date().getFullYear()}`);
	// Projects
	config.addPairedShortcode("projectColumn", function(content) {
		return `
			<div class="project-desc__column">
				${content}
			</div>
			`;
	});
	config.addPairedShortcode("projectDesc", function(content, title) {
		return `
			<div>
				<h2 class="project-desc__heading">${title}</h2>
				${content}
			</div>
			`;
	});
	// <picture>
	async function imageShortcode(src, className, alt, width) {
		if(alt === undefined) {
			throw new Error(`Missing \`alt\` on responsive image from: ${src}`);
		}

		let widths = [];
			widths.push(width, width*2);
		let metadataOriginal = await Image(src, {
			widths: widths,
			formats: [null],
			urlPath: "/images/",
			outputDir: "./dist/images/"
		});
		let metadataWebp = await Image(src, {
			widths: widths,
			formats: ["webp"],
			urlPath: "/images/",
			outputDir: "./dist/images/",
			sharpWebpOptions: {
				quality: 85,
				smartSubsample: true
			}
		});

		return `
			<picture>
				${Object.values(metadataWebp).map(imageFormat => {
					return `
						<source 
							type="${imageFormat[0].sourceType}"
							srcset="${imageFormat[0].url}, ${imageFormat[1].url} 2x">
					`;
				})}
				<img
					${Object.values(metadataOriginal).map(item => {
						return `
							src="${item[0].url}"					
							srcset="${item[0].url}, ${item[1].url} 2x"
							width="${item[0].width}"
							height="${item[0].height}"
						`;
					})}
					class="${className}"
					alt="${alt}"					
					decoding="async"
					loading="lazy">
	        </picture>
		`;
	}

	return {
		dir: {
			input: "src",
			output: "dist",
			includes: "_includes",
			layouts: "_layouts",
			data: "_data",
		},
		dataTemplateEngine: "njk",
		markdownTemplateEngine: false,
		htmlTemplateEngine: "njk",
		passthroughFileCopy: true,
		templateFormats: [
			"md",
			"njk",
		],
	};
};