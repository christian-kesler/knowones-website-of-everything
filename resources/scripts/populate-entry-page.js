			// A function that capitalizes the first letter of each word in a string
			function titleCase(str) {
				var split_string = str.toLowerCase().split(' ');
				for (var i = 0; i < split_string.length; i++) {
					split_string[i] = split_string[i].charAt(0).toUpperCase() + split_string[i].substring(1);     
				}
				return split_string.join(' '); 
			}

			// The function that Hides and Shows the Navlist
			function hideShowNavList() {
				var hidden = '0px';
				var shown = '280px';

				// If the NAVLIST is already shown (which it will not be by default upon loading the page)
				if (document.getElementById('populated-navlist-button').style.marginRight.includes(shown)) {

					// Set NAVLIST margins to the right and update button characters 
					document.getElementById('populated-navlist-button').style.marginRight = hidden;
					document.getElementById('populated-navlist').style.marginRight = '-280px';
					document.getElementById('populated-navlist-button').innerHTML = '&#60; &#60;';

					// Animate NAVLIST elements from their Shown position to their recently updated Hidden position
					document.getElementById("populated-navlist").animate([
						{ transform: 'translateX(-280px)' },
						{ transform: 'translateX(0px)' }
					], {
						duration: 750,
						iterations: 1
					});
					document.getElementById("populated-navlist-button").animate([
						{ transform: 'translateX(-280px)' },
						{ transform: 'translateX(0px)' }
					], {
						duration: 750,
						iterations: 1
					});
				} else {

					// Set NAVLIST margins to the lefft and update button characters
					document.getElementById('populated-navlist-button').style.marginRight = shown;
					document.getElementById('populated-navlist').style.marginRight = '0px';
					document.getElementById('populated-navlist-button').innerHTML = '&#62; &#62;';

					// Animate NAVLIST elements from their Hidden position to their recently updated Shown position
					document.getElementById("populated-navlist").animate([
						{ transform: 'translateX(280px)' },
						{ transform: 'translateX(0px)' }
					], {
						duration: 750,
						iterations: 1
					});
					document.getElementById("populated-navlist-button").animate([
						{ transform: 'translateX(280px)' },
						{ transform: 'translateX(0px)' }
					], {
						duration: 750,
						iterations: 1
					});
				}
			}


			// The function that populates all page data into preset elements
			$(function populatePageData() {


// =========================================================================================
// Populating the page HEADER
// 
// The page HEADER, BACKGROUND, CONTENT, and FOOTER are static
// =========================================================================================
				$("#populated-header").load("/resources/pages/populated-header.html");


// =========================================================================================
// Populating the page TITLE
// 
// The page TITLE can include a table of details for spells or monster statblocks
// If title_library does not have a table_row library, the table of details is hidden and only the TITLE path is populated
// =========================================================================================
				
				// Reading the name of this file
				var path_array = window.location.pathname.split("/");
				var path_array_length = path_array.length;

				if (path_array.length == 5) {
					var page_title = path_array.pop();
					var page_category = path_array.pop();
					var page_directory = path_array.pop();
					var page_subsite = path_array.pop();
					var page_site = path_array.pop();
				} else if (path_array.length == 4) {
					var page_title = path_array.pop();
					var page_directory = path_array.pop();
					var page_subsite = path_array.pop();
					var page_site = path_array.pop();
				} else if (path_array.length == 3) {
					var page_title = path_array.pop();
					var page_subsite = path_array.pop();
					var page_site = path_array.pop();
				} else if (path_array.length == 2) {
					var page_title = path_array.pop();
					var page_site = path_array.pop();
				} else if (path_array.length == 1) {
					var page_title = path_array.pop();
				} 

				if (page_subsite != undefined) {
					document.getElementById("populated-title-thead").innerHTML = "<a href='/" + page_subsite + ".html'>" + titleCase(page_subsite.replaceAll('-', ' ').replaceAll('.html', '')) + "</a>";
				} else {
					document.getElementById("populated-title-thead").innerHTML = titleCase(page_title.replaceAll('-', ' ').replaceAll('.html', ''));
				}
				if (page_directory != undefined) {
					document.getElementById("populated-title-thead").innerHTML += " > <a href='/" + page_subsite + "/" + page_directory + ".html'>" + titleCase(page_directory.replaceAll('-', ' ').replaceAll('.html', '')) + "</a>";
				}
				if (page_category != undefined) {
					document.getElementById("populated-title-thead").innerHTML += " > <a href='/" + page_subsite + "/" + page_directory + "/" + page_category + ".html'>" + titleCase(page_category.replaceAll('-', ' ').replaceAll('.html', '')) + "</a>";
				}

				// Reading data from our JSON file
				$.getJSON(`/` + page_subsite + `/` + page_directory + `.json`, function(data) {

					// Looping through the JSON data 
					$.each(data.entries, function(i, f) {

						// Finding the entry that matches this file
						if (f.entry_name.toLowerCase().replaceAll(/\s/g, '-').replaceAll("'", "") + ".html" == page_title) {

							if (f.content_source != undefined && f.content_source !== ""){
								document.getElementById("populated-title-thead").innerHTML += " > <a target='blank' href='" + f.content_source + "'>" + titleCase(page_title.replaceAll('-', ' ').replaceAll('.html', '')) + " (source)</a>";
							} else {
								document.getElementById("populated-title-thead").innerHTML += " > " + titleCase(page_title.replaceAll('-', ' ').replaceAll('.html', ''));
							}

							// If Title Library Exists
							if (f.title_library != undefined) {
								for (var x = 0; f.title_library.length > x; x++) {
									if (f.title_library[x].table_row != undefined) {
										var table_row1 = "<tr>";
										var table_row2 = "<tr>";
										for (var y = 0; f.title_library[x].table_row.length > y; y++) {
											if (f.title_library[x].table_row[y].heading != undefined && f.title_library[x].table_row[y].content != undefined && f.title_library[x].table_row[y].heading !== "" && f.title_library[x].table_row[y].content !== "") {
												table_row1 += "<th style='width: 15vw'>" + f.title_library[x].table_row[y].heading + "</th>";
												table_row2 += "<td style='width: 15vw'>" + f.title_library[x].table_row[y].content + "</td>";
											}
										}
										table_row += "</tr>";
										if (!table_row1.includes("<tr></tr>") && !table_row2.includes("<tr></tr>")) {
											$(table_row1).appendTo("#populated-title tbody");
											$(table_row2).appendTo("#populated-title tbody");
										}
									}
								}
							}


// =========================================================================================
// Populating the page ATTRIBUTES
// 
// The ATTRIBUTES table can include a table of details for wiki entries such as monsters or planescapes
// If attribute_library does not have a additional entries, the table of details is hidden and only the ATTRIBUTE image is populated
// =========================================================================================

							// If Attribute Library Exists
							if (f.attribute_library != undefined) {
								if (f.attribute_library[0] != undefined) {
									
									// Table Row #1:  Rehosted Art
									if (f.attribute_library[0].img_rehosted != undefined && f.attribute_library[0].img_rehosted_source != undefined && f.attribute_library[0].img_rehosted !== "" && f.attribute_library[0].img_rehosted_source !== "") {
										var table_row = "<tr><th colspan='2'><img id='populated-attributes-image' alt='" + f.entry_name + "' target='blank' src='" + f.attribute_library[0].img_rehosted + "' onclick='window.open(`" + f.attribute_library[0].img_rehosted_source + "`)' style='display:block'></th></tr>";
									} else {
										var table_row = "<tr><th colspan='2'><img id='populated-attributes-image' alt='" + f.entry_name + "' target='blank' src='/resources/images/WikiPlaceholder.png' onclick='window.open(this.src)'></th></tr>";
									}
									$(table_row).appendTo("#populated-attributes tbody");
									

									// Table Row #2:  Linked Art
									if (f.attribute_library[0].img_linked != undefined && f.attribute_library[0].img_linked_source != undefined && f.attribute_library[0].img_linked !== "" && f.attribute_library[0].img_linked_source !== "") { 
										var table_row = "<tr><th colspan='2'><i><a href='" + f.attribute_library[0].img_linked + "' target='_blank'>Additional Art</a> and <a href='" + f.attribute_library[0].img_linked_source + "' target='blank'>(source)</a></i></th></tr>";
									} else {
										var table_row = "<tr><th colspan='2'><i>No Additional Art Available</a></i></th></tr>";
									}
									$(table_row).appendTo("#populated-attributes tbody");


									// If the library contains data for a wiki wtyle table
									if (f.attribute_library[1] != undefined) {
										
										// Table Row #3:  Entry Name
										var table_row = "<tr><th colspan='2'>" + f.entry_name + "</th></tr>";
										$(table_row).appendTo("#populated-attributes tbody");

										// Table Row #4:  Species 
										if (f.attribute_library[0].species != undefined && f.attribute_library[0].species !== "") {
											var table_row = "<tr><th colspan='2'>(" + f.attribute_library[0].species + ")</th></tr>";
										} else {
											var table_row = "<tr><th colspan='2'>(Unknown Species)</th></tr>";
										}
										$(table_row).appendTo("#populated-attributes tbody");


										// Table Row(s) #5-n:  Attribute Details
										for (var z = 0; f.attribute_library.length > z; z++) {
											if (f.attribute_library[z].heading != undefined && f.attribute_library[z].sublibrary !== "") {
												var table_row = "<tr><th colspan='2'>" + f.attribute_library[z].heading + "</th></tr>";
												$(table_row).appendTo("#populated-attributes tbody");
												for (var y = 0; f.attribute_library[z].sublibrary.length > y; y++) {
													if (f.attribute_library[z].sublibrary[y].subheading != undefined && f.attribute_library[z].sublibrary[y].subcontent != undefined && f.attribute_library[z].sublibrary[y].subheading !== "" && f.attribute_library[z].sublibrary[y].subcontent !== "") {
														var table_row = "<tr><td>" + f.attribute_library[z].sublibrary[y].subheading + "</td><td>" + f.attribute_library[z].sublibrary[y].subcontent + "</td></tr>";
														$(table_row).appendTo("#populated-attributes tbody");
													}
												}
											}
										}
									} 
								} else {
									// Table Row #1:  Rehosted Art
									var table_row = "<tr><th colspan='2'><img id='populated-attributes-image' alt='" + f.entry_name + "' target='blank' src='/resources/images/WikiPlaceholder.png' onclick='window.open(this.src)'></th></tr>";
									$(table_row).appendTo("#populated-attributes tbody");
									
									// Table Row #2:  Linked Art
									var table_row = "<tr><th colspan='2'><i>No Additional Art Available</a></i></th></tr>";
									$(table_row).appendTo("#populated-attributes tbody");
								}
							} else {
								// Table Row #1:  Rehosted Art
								var table_row = "<tr><th colspan='2'><img id='populated-attributes-image' alt='" + f.entry_name + "' target='blank' src='/resources/images/WikiPlaceholder.png' onclick='window.open(this.src)'></th></tr>";
								$(table_row).appendTo("#populated-attributes tbody");
								
								// Table Row #2:  Linked Art
								var table_row = "<tr><th colspan='2'><i>No Additional Art Available</a></i></th></tr>";
								$(table_row).appendTo("#populated-attributes tbody");
							}


// =========================================================================================
// Populating the page DESCRIPTION and NAVLIST
// 
// The DESCRIPTION div can any number of headings and paragraphs
// The NAVLIST is updated with links to the DESCRIPTION headings as they are populated
// =========================================================================================

							// Populating the page title in the floating nav table
							var table_row = "<tr><th><a href='#populated-title'>" + f.entry_name + "</a></th></tr>";
							$(table_row).appendTo("#populated-navlist-table tbody");

							// If Description Library Exists
							if (f.description_library != undefined) {

								// Populating Description Overview underneath title table with no heading
								if (f.description_library[0].overview != undefined && f.description_library[0].overview !== "") {
									document.getElementById("fixed-description").innerHTML = "<p>" + f.description_library[0].overview + "</p>";
								}

								// Looping through all Library entries
								for (var x = 0; f.description_library.length > x; x++) {

									// Determining if Heading should be shown
									if (f.description_library[x].content != undefined && f.description_library[x].content !== "") {
										var showHeading = true;
									} else if (f.description_library[x].sublibrary != undefined) {
										for (var w = 0; f.description_library[x].sublibrary.length > w; w++) {
											if (f.description_library[x].sublibrary[w].subheading != undefined && f.description_library[x].sublibrary[w].subcontent != undefined && f.description_library[x].sublibrary[w].subheading !== "" && f.description_library[x].sublibrary[w].subcontent !== "") {
												var showHeading = true;
											}
										}
									} else {
										var showHeading = false;
									}

									// Populating Heading
									if (f.description_library[x].heading != undefined && f.description_library[x].heading !== "" && showHeading) {
										document.getElementById("fixed-description").innerHTML += "<div id='" + f.description_library[x].heading.toLowerCase().replace(/\s/g, '-').replace(`'`, ``) + "'><h3>" + f.description_library[x].heading + "</h3></div>";

										// Populating the page heading in the floating nav table
										var table_row = "<tr><td><a style='margin-left: 10px' href='#" + f.description_library[x].heading.toLowerCase().replace(/\s/g, '-').replace(`'`, ``) + "'>" + f.description_library[x].heading + "</a></td></tr>";
										$(table_row).appendTo("#populated-navlist-table tbody");

										// Populating Heading Content
										if (f.description_library[x].content != undefined && f.description_library[x].content !== "") {
											document.getElementById("fixed-description").innerHTML += "<p>" + f.description_library[x].content + "</p>";
										}

										// If Sublibrary Exists
										if (f.description_library[x].sublibrary != undefined) {

											// Looping through all Sublibrary entries
											for (var w = 0; f.description_library[x].sublibrary.length > w; w++) {

												// Populating Subheading and Subcontent
												if (f.description_library[x].sublibrary[w].subheading != undefined && f.description_library[x].sublibrary[w].subcontent != undefined && f.description_library[x].sublibrary[w].subheading !== "" && f.description_library[x].sublibrary[w].subcontent !== "") {
													document.getElementById("fixed-description").innerHTML += "<div id='" + f.description_library[x].sublibrary[w].subheading.toLowerCase().replace(/\s/g, '-').replace(`'`, ``) + "'><h4>&#8226;  " + f.description_library[x].sublibrary[w].subheading + "</h4></div><p>" + f.description_library[x].sublibrary[w].subcontent + "</p>";

													// Populating the page heading in the floating nav table
													var table_row = "<tr><td><a style='margin-left: 20px' href='#" + f.description_library[x].sublibrary[w].subheading.toLowerCase().replace(/\s/g, '-').replace(`'`, ``) + "'>&#8226;  " + f.description_library[x].sublibrary[w].subheading + "</a></td></tr>";
													$(table_row).appendTo("#populated-navlist-table tbody");

												}
											}
										}
									}
								}
							}
						}
					});
				});


// =========================================================================================
// Populating the page FOOTER
// 
// The page HEADER, BACKGROUND, CONTENT, and FOOTER are static
// =========================================================================================
				$("#populated-footer").load("/resources/pages/populated-footer.html");
			});
