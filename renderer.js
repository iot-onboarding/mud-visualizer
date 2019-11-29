var traffic_direction = "incoming";
var excluded_models = [];
var tooltip_status;
var hover_ready = true;
var incoming_mudfile;

function mud_drawer(inp_json) {
    d3.selectAll("svg > *").remove();
    var graph = JSON.parse(JSON.stringify(inp_json));
    // var graph = inp_json;
    var svg = d3.select("svg");
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    // // zoom , needs fix and clearance
    // var svg = d3.select("svg.svg")
    // .call(d3.zoom().on("zoom", function () {
    //    svg.attr("transform", d3.event.transform)
    // }));

    d3.select("svg").attr("height", height)
    d3.select("svg").attr("width", width)

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(
                function (d) {
                    return d.id;
                })
            .distance(100)
            .strength(0.001))
        .force("charge", d3.forceManyBody()
            .strength(-200)
            .distanceMax(500)
            .distanceMin(50))
        .force("x", d3.forceX(function (d) {
            if (d.group == "01" || d.group == "02") {
                return 3.2 * (width) / 5
            } else if (d.group === "1") {
                return 4 * (width) / 5
            } else if (d.group === "2") {
                return 2.5 * (width) / 5
            } else if (d.group === "3") {
                return 1.8 * (width) / 5
            } else if (d.group === "4") {
                return 1 * (width) / 5
            } else {
                return 0 * (width) / 5
            }
        }).strength(1))
        .force("y", d3.forceY(function (d) {
            if (d.group == "01" || d.group == "02") {
                return 1.6 * (height) / 4
            }
            return height / 2;
        }).strength(0.1))
        // .force("center", d3.forceCenter((width) / 2, height / 2))
        .force("collision", d3.forceCollide().radius(35));

    // ######################################
    // # Read graph.json and draw SVG graph #
    // ######################################


    // d3.selectAll("svg > *").remove();
    var oig_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var orig_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


    link_color = "black";
    link_hover_color = "green";

    for (var i = 0; i < graph.links.length; i++) {
        graph.links[i].linknum = 1;
        for (var j = 0; j < i; j++) {
            if ((graph.links[i].source == graph.links[j].source && graph.links[i].target == graph.links[j].target)
                ||
                (graph.links[i].source == graph.links[j].target && graph.links[i].target == graph.links[j].source)) {
                graph.links[i].linknum += 0.5;
            }
        }
    }
    ;

    var link = svg.append("g")
        .selectAll("path")
        .data(graph.links.filter(function (d) {
            return (
                (set_difference(get_devices_names(d['outgoing']['device:flow']), excluded_models).length > 0 ||
                    set_difference(get_devices_names(d['incoming']['device:flow']), excluded_models).length > 0) && // this filters the mudfile links that are deselected in the selection menu
                !excluded_models.includes(d.source) && // also filter if the source or destination of the connection is in the exclusion list
                !excluded_models.includes(d.target)
            )
        }))
        .enter().append("svg:path")
        .attr("fill", "none")
        .attr("stroke", link_color)
        .attr("stroke-width", function (d) {
            return Math.sqrt(parseInt(1));
        })
        .attr("src", function (d) {
            return d.source;
        })
        .attr("dst", function (d) {
            return d.target;
        })
        .attr("deviceflows", function (d) {
            return JSON.stringify(d[traffic_direction]["device:flow"]);
        });


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("a")
        .data(graph.nodes.filter(function (d) {
            var this_node_obj = allNodesObj.getNode(d.name);
            if (this_node_obj.is_controlle_or_mycontroller()) { // if it's a mycontroller of controller, the name does not neccessarily need to be in the contorller node
                return (set_difference(this_node_obj.get_group1_devices('outgoing'), excluded_models).length > 0 ||
                    set_difference(this_node_obj.get_group1_devices('incoming'), excluded_models).length > 0);
            }
            return !excluded_models.includes(this_node_obj.name) &&
                (set_difference(this_node_obj.get_group1_devices('outgoing'), excluded_models).length > 0 ||
                    set_difference(this_node_obj.get_group1_devices('incoming'), excluded_models).length > 0);
        }))
        .enter().append("a")
        .attr("destination", '_blank');
    // the last two lines could probably be removed

    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("image")
        .attr('id', function (d) {

            switch (d.group) {
                case "01":
                case "02":
                case "1":
                    if ($("visualnode1").length < 1) {
                        return "visualnode1";
                    }
                case "2":
                    if ($("visualnode2").length < 1) {
                        return "visualnode2";
                    }
                case "3":
                    if ($("visualnode3").length < 1) {
                        return "visualnode3";
                    }
                case "4":
                    if ($("visualnode4").length < 1) {
                        return "visualnode4";
                    }
            }
        })
        .attr("xlink:href", function (d) {
            switch (d.group) {
                case "01":
                    return "img/controller.svg";
                case "02":
                    return "img/controller.svg";
                default:
                    return ("img/group" + d.group + ".svg");
            }
        })
        .attr("width", function (d) {
            switch (d.group) {
                case "3":
                    return 130;
                default:
                    return 50;
            }
        })
        .attr("height", function (d) {
            switch (d.group) {
                case "3":
                    return 130;
                default:
                    return 50;
            }
        })
        .attr("x", function (d) {
            switch (d.group) {
                case "3":
                    return -70;
                case "4":
                    return -40;
                default:
                    return -5;
            }
        })
        .attr("y", function (d) {
            switch (d.group) {
                case "3":
                    return -50;
                default:
                    return -20;
            }
        })
        .attr("fill", function (d) {
            return color(d.group);
        });

    node.append("text")
        .attr("font-size", "0.8em")
        .attr("dx", function (d) {
            switch (d.group) {
                case "01":
                    return -40;
                case "02":
                    return -40;
                case "1":
                    return -15;
                case "2": //router logo x axis
                    return -30;
                case "3": // intenret logo x axis
                    return 5;
                case "4":
                    return -(d.id.length * 7);
                default:
                    return 5;
            }
        })
        // .attr("dy", ".35em")
        .attr("dy", function (d) {
            switch (d.group) {
                case "2": //router logo y axis
                    return 45;
                case "3": // intenret logo y axis
                    return -30;
                case "4":
                    return -25;
                default:
                    return -26;
            }
        })
        .attr("x", 8)
        .text(function (d) {
            switch (d.group) {
                case "02":
                    return "My-Controller: " + d.id
                case "3":
                    return; // for internet logo we don't need text
                default:
                    return d.id;
            }
        });

    node.append("title")
        .text(function (d) {
            return d.id;
        });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);


    function ticked() {
        link
            .attr("d", linkArc);
        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")"
            });
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = oig_width / d.linknum;
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function dragstarted(d) {
        if (d.group == '1' || d.group == '0') {
            d3.select(this).select('image').transition()
                .duration(100)
                .attr("width", 50)
                .attr("height", 50);
        }
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (d.group == '1' || d.group == '0') {
            d3.select(this).select('image').transition()
                .duration(100)
                .attr("width", 60)
                .attr("height", 60);
        }
        if (!d3.event.active) simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;
        d.fx = d3.event.x;
        d.fy = d3.event.y;

    }

    $("#nodestooltip").remove();

    var div = d3.select("#vizholder")
        .append("div")
        .attr("id", "nodestooltip")
        .attr("class", "node-tooltip")
        .style("bottom", "0px")
        .style("left", "0px")
        .style("height", "0px")
        .style("width", "0px")
        .style("opacity", 0);

    //makes draggable element
    $(function () {
        $("#nodestooltip").draggable();
    });

    node.on("mouseover", function (d) {

        d3.selectAll('*').interrupt();
        d3.selectAll('image').each(function (d) {
            if (d.group != "3" && d.group != "2") {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr("width", 50)
                    .attr("height", 50);
            } else {// this is for router and internet nodes
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('opacity', 1);
            }
        });
        d3.selectAll('path').each(function (d) {
            d3.select(this)
                .attr('opacity', 1);
        });
        var hovered_node = d;
        if (d.group == '1' || d.group == '01' || d.group == '02') {
            d3.selectAll('image').each(function (d) {
                if (!hovered_node[traffic_direction].devices.includes(d.id)) {
                    d3.select(this)
                        .transition()
                        // .duration(100)
                        .attr('opacity', 0.3);
                }
            });


            if (d[traffic_direction].links !== undefined) {
                d3.select(this).select('image').transition()
                    .duration(500)
                    .attr("width", 60)
                    .attr("height", 60);
                if (traffic_direction == "incoming") {
                    link_hover_color = 'red';
                } else if (traffic_direction == "outgoing") {
                    link_hover_color = 'green';
                }

                var current_node_links = d[traffic_direction].links;
                var current_device = d.id
                d3.selectAll('path').each(function (d, i) {
                    if (current_node_links.indexOf(d.uid) != -1) {
                        var current_link = allLinksObj.getLink_by_uid(d.uid);
                        if (d.source.name == current_link["source"] &&
                            d.target.name == current_link["target"] &&
                            get_devices_names(d[traffic_direction]["device:flow"]).includes(current_device)
                        ) {
                            totalLength = 20;
                            devices = d[traffic_direction]["device:flow"];
                            let direction = find_values_by_key(devices, current_device)[0];
                            direction == "normal" ? link_direction_coefficient = 1 : link_direction_coefficient = -1;
                            d3.select(this)
                                .style("stroke", link_hover_color)
                                .style("stroke-width", 2);
                            d3.select(this)
                                .attr("stroke-dasharray", totalLength / 2 + " " + totalLength / 5)
                                .attr("stroke-dashoffset", link_direction_coefficient * totalLength * 50)
                                .transition()
                                .duration(20000)
                                .ease(d3.easeLinear)
                                .attr("stroke-dashoffset", 0);
                        }
                    } else {
                        d3.select(this)
                        // .transition()
                        // .duration(100)
                            .attr('opacity', 0.5);
                    }
                })
            }
        }

    });


    node.on("mouseout", function (d) {


        if (d[traffic_direction].links !== undefined) {

            var current_node_links = d[traffic_direction].links;
            d3.selectAll('path').each(function (d, i) {
                    if (current_node_links.indexOf(d.uid) != -1) {
                        d3.select(this)
                            .style("stroke", link_color)
                            .style("stroke-width", 1);
                        totalLength = 0;
                        d3.select(this)
                            .attr("stroke-dasharray", totalLength + " " + totalLength)
                            .attr("stroke-dashoffset", totalLength);

                        // d3.select(this)
                        // .attr('opacity', 1);
                        //   .transition();
                    } else {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr('opacity', 1);
                    }
                }
            )
        }

        d3.selectAll('image').each(function (d) {
            if (d.group != "3" && d.group != "2") {

                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('opacity', 1)
                    .attr("width", 50)
                    .attr("height", 50);

            } else { // this is for router and internet nodes
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('opacity', 1);
            }
        });

    });

    node.on("click", function (d) {

        if (d.group == "1" || d.group == "01" || d.group == "02") {
            // for showing the information:
            var clicked_node = allNodesObj.getNode(d.name);
            var clicked_node_protocols = clicked_node.get_protocols(traffic_direction);
            div
                .html(function () {
                    let table = '<table id="ace_protocols">'
                    if (traffic_direction == "outgoing") {
                        table += "<tr>\
            <th>Destination</th>";
                    } else if (traffic_direction == "incoming") {
                        table += "<tr>\
            <th>Source</th>";
                    }
                    table += "<th>Transport</th>\
                    <th>Protocol</th>\
                    <th>Src Port</th>\
                    <th>Dst Port</th>\
                    </tr>"

                    for (var protocol_idx in clicked_node_protocols) {
                        let current_protocol = clicked_node_protocols[protocol_idx];

                        var src_port_list_with_repeat = current_protocol.src_dst_ports_tuples.map(function (a) {
                            return a[0]
                        });
                        var dst_port_list_with_repeat = current_protocol.src_dst_ports_tuples.map(function (a) {
                            return a[1]
                        });

                        var unique_src_ports = [...new Set(src_port_list_with_repeat)];
                        var unique_dst_ports = [...new Set(dst_port_list_with_repeat)];

                        var repeated_src_ports = repeated_elements(src_port_list_with_repeat);
                        var repeated_dst_ports = repeated_elements(dst_port_list_with_repeat);

                        var unrepeated_src_ports = set_difference(src_port_list_with_repeat, repeated_src_ports);
                        var unrepeated_dst_ports = set_difference(dst_port_list_with_repeat, repeated_dst_ports)

                        for (var port_idx in unique_src_ports) {
                            var src_port = unique_src_ports[port_idx];
                            if (!excluded_models.includes(current_protocol.target) && current_protocol.target != null) { // protocols with null targets are just template protocols and will be filled later with the updater methods
                                if (repeated_src_ports.includes(src_port)) {
                                    var matching_dst_ports = [...new Set(current_protocol.src_dst_ports_tuples.filter(a => a[0] == src_port).map(function (a) {
                                        return a[1]
                                    }))];
                                    table += "<tr><td>" + current_protocol.target + "</td>";
                                    table += "<td>" + current_protocol.transport + "</td>";
                                    table += "<td>" + current_protocol.network + "</td>";
                                    table += "<td>" + src_port + "</td>";
                                    table += "<td>" + matching_dst_ports.join(', ') + "</td>";
                                    table += "</tr>"
                                } else { // here we have to check if the destination port of the target src_port is not in repeated_dst_ports then we print it
                                    var target_dst_port = current_protocol.src_dst_ports_tuples.filter(a => a[0] == src_port)[0][1];
                                    if (!repeated_dst_ports.includes(target_dst_port)) {
                                        table += "<tr><td>" + current_protocol.target + "</td>";
                                        table += "<td>" + current_protocol.transport + "</td>";
                                        table += "<td>" + current_protocol.network + "</td>";
                                        table += "<td>" + src_port + "</td>";
                                        table += "<td>" + target_dst_port + "</td>";
                                        table += "</tr>"
                                    }
                                }
                            }
                        }

                        for (var port_idx in unique_dst_ports) {
                            var dst_port = unique_dst_ports[port_idx];
                            if (!excluded_models.includes(current_protocol.target) && current_protocol.target != null) { // protocols with null targets are just template protocols and will be filled later with the updater methods
                                if (repeated_dst_ports.includes(dst_port)) {
                                    var matching_src_ports = [...new Set(current_protocol.src_dst_ports_tuples.filter(a => a[1] == dst_port).map(function (a) {
                                        return a[0]
                                    }))];

                                    table += "<tr><td>" + current_protocol.target + "</td>";
                                    table += "<td>" + current_protocol.transport + "</td>";
                                    table += "<td>" + current_protocol.network + "</td>";
                                    table += "<td>" + matching_src_ports.join(', ') + "</td>";
                                    table += "<td>" + dst_port + "</td>";
                                    table += "</tr>"
                                } else { // here we have to check if the destination port of the target src_port is not in repeated_dst_ports then we print it
                                    var target_src_port = current_protocol.src_dst_ports_tuples.filter(a => a[1] == dst_port)[0][0];
                                    if (!repeated_src_ports.includes(target_src_port) && !unrepeated_src_ports.includes(target_src_port)) {
                                        table += "<tr><td>" + current_protocol.target + "</td>";
                                        table += "<td>" + current_protocol.transport + "</td>";
                                        table += "<td>" + current_protocol.network + "</td>";
                                        table += "<td>" + target_src_port + "</td>";
                                        table += "<td>" + dst_port + "</td>";
                                        table += "</tr>"
                                    }
                                }
                            }
                        }
                    }
                    table += '</table>'
                    return table;
                })
                // the next two lines is in case the table information is to be placed close to node instead of top left
                //  .style("top", d.y - 50 + "px")
                //  .style("left", d.x - 600 + "px")

                .style("margin-top", "10px")
                .style("margin-left", "85px")
                .style("display", "block")
                .style("height", null)
                .style("width", null)
                .style("bottom", null)
                .style("z-index", 1);
            div.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip_status = 'just-clicked';
        }
    });


    // link.on("mouseover", function () { d3.select(this).style("stroke", link_hover_color); });
    // link.on("mouseout", function () { d3.select(this).style("stroke", link_color) });


}


var network = new Mud_Network();
var network_data;
var userAgent = navigator.userAgent.toLowerCase();
network.ready_to_draw = false;


if (userAgent.indexOf(' electron/') > -1) {
    // in case we are running electron
    function opengithub() {
        // used in about.html page
        var {shell} = require('electron');
        let url = "https://github.com/vafa-Andalibi/mudvisualizer";
        shell.openExternal(url);
    }

    require('electron').ipcRenderer.on('draw', (event, message) => {
        d3.selectAll("svg > *").remove();
        var remote = require('electron').remote;

        network.ready_to_draw = false;
        // let data = remote.getGlobal('sharedObj');
        let sharedobj = JSON.parse(remote.getGlobal('sharedObj'));
        for (var mudfile_idx in sharedobj) {
            try {
                network.add_mudfile(JSON.parse(sharedobj[mudfile_idx]));
            } catch (e) {
                let html_message = "<div style='text-align: left; padding: 5px;'>The following JSON file is not valid:</div>";
                html_message += "<pre style='border: 1px solid #555555;text-align: left; overflow-x: auto;'>" + sharedobj[mudfile_idx] + "</pre>"
                Swal.fire({
                    type: 'error',
                    title: 'Not a valid json file',
                    showConfirmButton: true,
                    html: html_message
                });
            }
        }
        // network.add_mudfile(JSON.parse(data));
        network.create_network()

        var interval = setInterval(function () {
            if (network.ready_to_draw == false) {
                return;
            }
            clearInterval(interval);
            network_data = network.get_nodes_links_json();
            mud_drawer(network_data);
        }, 100);
    })


    require('electron').ipcRenderer.on('resize', (event, message) => {
        width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        d3.select("svg").attr("height", height);
        d3.select("svg").attr("width", width);
    })


    require('electron').ipcRenderer.on('clearsvg', (event, message) => {
        d3.selectAll("svg > *").remove();
    });
}

// this is for fading in/out select mud-file menu
var mudfile_select_menu_open = false;


$("#SelectMudFiles").click(function () {
    if (mudfile_select_menu_open == false) {
        $("#mudSelectionDiv").fadeIn("slow", function () {
            mudfile_select_menu_open = true;
        }).css("display", "block");
        ;
    }
});

$("div:not(#mudSelectionDiv)").click(function () {
    if (mudfile_select_menu_open == true) {
        $("#mudSelectionDiv").fadeOut("slow", function () {
            mudfile_select_menu_open = false;
        });
    }
});

$("div:not(#nodestooltip)").click(function () {
    if (tooltip_status == 'ready-to-hide') {
        $("div[id='nodestooltip']").each(function () {
            $(this).animate({opacity: 0}, {duration: 100})
                .animate({
                    bottom: "0px",
                    // left: "0px",
                    height: "0px",
                    width: "0px",
                }, function () {
                    $(this).css('z-index', -1)
                })
        });
    } else if (tooltip_status = 'just-clicked') {
        tooltip_status = 'ready-to-hide';
    }
});

// selecting/unselecting a mudfile
$('body').on('click', 'input[id="mudcheckbox"]', function () {
    if ($(this).prop("checked")) {
        let item_idx = excluded_models.indexOf($(this).val());
        var checked_item_name = excluded_models[item_idx];

        excluded_models.splice(item_idx, 1);

        var checked_mud_controller = allNodesObj.getNode(checked_item_name).get_controller();
        if (checked_mud_controller != null) {
            let controller_idx = excluded_models.indexOf(checked_mud_controller);
            excluded_models.splice(controller_idx, 1);
        }

        var checked_mud_mycontroller = allNodesObj.getNode(checked_item_name).get_mycontroller();
        if (checked_mud_mycontroller != null) {
            let mycontroller_idx = excluded_models.indexOf(checked_mud_mycontroller);
            excluded_models.splice(mycontroller_idx, 1);
        }


    } else {
        var unchecked_mud_name = $(this).val();
        excluded_models.push(unchecked_mud_name);

        var checked_nodes = $("#mudcheckbox:checked").map(function () {
            return (this.value)
        }).toArray()
        var checked_controllers = checked_nodes.map(function (d) {
            return (allNodesObj.getNode(d).get_controller())
        })
        var unchecked_mud_controller = allNodesObj.getNode(unchecked_mud_name).get_controller();
        if (unchecked_mud_controller != null && !checked_controllers.includes(unchecked_mud_controller)) {
            excluded_models.push(unchecked_mud_controller);
        }

        var checked_mycontrollers = checked_nodes.map(function (d) {
            return (allNodesObj.getNode(d).get_mycontroller())
        })
        var unchecked_mud_controller = allNodesObj.getNode(unchecked_mud_name).get_mycontroller();
        var unchecked_mud_mycontroller = allNodesObj.getNode(unchecked_mud_name).get_mycontroller();
        if (unchecked_mud_mycontroller != null && !checked_mycontrollers.includes(unchecked_mud_controller)) {
            excluded_models.push(unchecked_mud_mycontroller);
        }
    }
    d3.selectAll("svg > *").remove();
    drawer();
});

// used in mainWindow.html in refresh button
function drawer() {
    if (network_data != null) {
        d3.selectAll("svg > *").remove();
        mud_drawer(network_data);
    }
}


// used in mainWindow.html in refresh button
function set_incoming() {
    traffic_direction = "incoming";

    $("#button_outgoing").removeClass("outgoing-down");
    if (!$("#button_incoming").hasClass("incoming-down")) {
        $("#button_incoming").toggleClass("incoming-down");
    }
}

// used in mainWindow.html in refresh button
function set_outgoing() {
    traffic_direction = "outgoing";
    $("#button_incoming").removeClass("incoming-down");
    if (!$("#button_outgoing").hasClass("outgoing-down")) {
        $("#button_outgoing").toggleClass("outgoing-down");
    }

}

set_outgoing();

// used in about.html page
function opengithub() {
    const {shell} = require('electron');
    let url = "https://github.com/vafa-Andalibi/mudvisualizer";
    shell.openExternal(url);
}

function get_devices_names(arr) {
    let device_ids = [];
    for (var s in arr) {
        device_ids.push(Object.keys(arr[s])[0]);
    }
    return device_ids;
}

function openfile() {
    var files_data = {};
    dialog.showOpenDialog({properties: ["multiSelections", "openFile"]}, (fileNames) => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
            console.log("No file selected");
            return;
        }

        for (var file_idx in fileNames) {
            var filepath = fileNames[file_idx];
            var data = fs.readFileSync(filepath, 'utf-8');
            files_data[file_idx] = data;
        }
        global.sharedObj = JSON.stringify(files_data);
        mainWindow.webContents.send('draw', 'draw');
    });
    json_data_loaded = true;
}


$('#openfile-button').click(function () {
    $('#openfile-input').click();
});

$('#openfile-input').change(function () {
    var files = document.getElementById('openfile-input').files;
    var filescontent = {};
    // files is a FileList of File objects. List some properties.

    var output = [];
    var counter = 0;
    for (var i = 0, f; f = files[i]; i++) {
        (function (file) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    try {
                        filescontent[counter] = JSON.parse(e.target.result);
                    } catch (error) {
                        let html_message = "<div style='text-align: left; padding: 5px;'>The following JSON file is not valid:</div>";
                        html_message += "<pre style='border: 1px solid #555555;text-align: left; overflow-x: auto;'>" + e.target.result + "</pre>"
                        Swal.fire({
                            type: 'error',
                            title: 'Not a valid json file',
                            showConfirmButton: true,
                            html: html_message
                        });
                    }
                    // alert('json global var has been set to parsed json of this file here it is unevaled = \n' + JSON.stringify(filescontent[i]));
                    if (counter == files.length - 1) {
                        network.ready_to_draw = false;
                        for (var mudfile_idx in filescontent) {
                            network.add_mudfile(filescontent[mudfile_idx]);
                        }
                        network.create_network();

                        var interval = setInterval(function () {
                            if (network.ready_to_draw == false) {
                                return;
                            }
                            clearInterval(interval);
                            network_data = network.get_nodes_links_json();
                            mud_drawer(network_data);
                        }, 100);
                        $("#openfile-input")[0].value = "";
                    }
                    counter += 1;
                }
            })(f);
            reader.readAsText(f);
        })(f);
    }
});


// loading the default devices
network.ready_to_draw = false;
for (var mudfile_idx in default_mudfiles) {
    network.add_mudfile(default_mudfiles[mudfile_idx]);
}

if (incoming_mudfile != null && incoming_mudfile != "") {
    network.add_mudfile(JSON.parse(incoming_mudfile));
}


network.create_network()

var interval = setInterval(function () {
    if (network.ready_to_draw == false) {
        return;
    }
    clearInterval(interval);
    network_data = network.get_nodes_links_json();
    mud_drawer(network_data);
}, 100);


function tour() {
    $("#visualnode1").attr("data-intro", "Devices are shown in this area").attr("data-step", "8");
    $("#visualnode2").attr("data-intro", "This is the gataeway/router").attr("data-step", "9");
    $("#visualnode3").attr("data-intro", "If the traffic goes through here, it means it passes through the internet").attr("data-step", "10");
    $("#visualnode4").attr("data-intro", "Servers are shown on this side").attr("data-step", "11");
    introJs().start();
}

function openurl() {
    Swal.fire({
        title: 'Enter the MUD file URL',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Load URL',
        showLoaderOnConfirm: true,
        preConfirm: (url) => {
            // collect the data using https
            var data = "";
            $.ajax({
                url: 'https://www.mudmaker.org/cloud-service.json',
                cors: true,
                headers: {'Access-Control-Allow-Origin': '*'},
                dataType: 'JSON',
                jsonpCallback: 'photo',
                type: 'GET',
                success: function (data) {
                    console.log(data);
                    var recv_filescontent;
                    try {
                        var recv_filescontent = JSON.parse(data);
                    } catch (error) {
                        let html_message = "<div style='text-align: left; padding: 5px;'>The following JSON file is not valid:</div>";
                        html_message += "<pre style='border: 1px solid #555555;text-align: left; overflow-x: auto;'>" + e.target.result + "</pre>"
                        Swal.fire({
                            type: 'error',
                            title: 'Not a valid json file',
                            showConfirmButton: true,
                            html: html_message
                        });
                    }
                    network.ready_to_draw = false;

                    network.add_mudfile(recv_filescontent);

                    network.create_network();

                    var interval = setInterval(function () {
                        if (network.ready_to_draw == false) {
                            return;
                        }
                        clearInterval(interval);
                        network_data = network.get_nodes_links_json();
                        mud_drawer(network_data);
                    }, 100);
                },
                error: function (e) {
                    console.log(e)
                }
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}
