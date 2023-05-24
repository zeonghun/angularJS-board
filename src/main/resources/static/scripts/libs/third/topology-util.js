/*
 - 
 - FileName	: topology-util.js
 - Package	: css/ymtech_layout
 - 
 - 
 - Date  	: 2022. 12. 27. 오후 2:14:00
 - Author	: jwlee
 - Email	: jwlee@ymtech.co.kr
 - 
 */

/**
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ===== START : 전역변수
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 */
 
/**
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ===== E N D : 전역변수
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ===== START : d3 - Tree
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 */

var topologyObj = null;

class FloorPlanTopology {
    constructor(selector, width, height, scope) {
        this.$scope = scope;

        // Init
        this.divElement = d3.select(selector);
        this.divElement.selectAll("*").remove();
        this.svgElement = this.divElement.append("svg")
            .attr("id", "svg")
            .style("width", "100%")
            .style("height", "100%");
    
        // set Line Group
        this.svgElement.append("g").attr("id", "lines");

        this.lines = {};

        this.svgWidth = width;
        this.svgHeight = height;

        this.zoom = d3.zoom();
        this.transform = { k: 0, x: 0, y: 0 };
        // this.orgTransform = { x: -1023.5691190934745, y: -73.77791498694936, k: 1.741101126592253 };
    }

    getSvgElement() {
        return this.svgElement;
    }

    getTopGroup() {
        return this.divElement;
    }

    getLineGroup() {
        return this.svgElement.select("#lines");
    }

    setLines(boundaryDataList, ctx) {

        console.debug("data: ", boundaryDataList);
        let lineObj = d3.line();
        let gen = [];

        this.ratio = 125;
        this.ratioy = 0;
        this.correction = [0, 0];

        this.minBeginX = 99999999;
        this.maxBeginX = 0;
        this.minBeginY = 99999999;
        this.maxBeginY = 0;
        this.minEndX = 99999999;
        this.maxEndX = 0;
        this.minEndY = 99999999;
        this.maxEndY = 0;

        let cnt = 0;
        let sum = 0;

        for (let a = 0; a < boundaryDataList.length; a++) {
            for (let b = 0; b < boundaryDataList[a].boundarys.length; b++) {
                if (boundaryDataList[a].boundarys[b].begin_x < this.minBeginX) {
                    this.minBeginX = boundaryDataList[a].boundarys[b].begin_x;
                }
                if (boundaryDataList[a].boundarys[b].begin_x > this.maxBeginX) {
                    this.maxBeginX = boundaryDataList[a].boundarys[b].begin_x;
                }
                if (boundaryDataList[a].boundarys[b].begin_y < this.minBeginY) {
                    this.minBeginY = boundaryDataList[a].boundarys[b].begin_y;
                }
                if (boundaryDataList[a].boundarys[b].begin_y > this.maxBeginY) {
                    this.maxBeginY = boundaryDataList[a].boundarys[b].begin_y;
                }
                if (boundaryDataList[a].boundarys[b].end_x < this.minEndX) {
                    this.minEndX = boundaryDataList[a].boundarys[b].end_x;
                }
                if (boundaryDataList[a].boundarys[b].end_x > this.maxEndX) {
                    this.maxEndX = boundaryDataList[a].boundarys[b].end_x;
                }
                if (boundaryDataList[a].boundarys[b].end_y < this.minEndY) {
                    this.minEndY = boundaryDataList[a].boundarys[b].end_y;
                }
                if (boundaryDataList[a].boundarys[b].end_y > this.maxEndY) {
                    this.maxEndY = boundaryDataList[a].boundarys[b].end_y;
                }
                cnt++;
                sum += boundaryDataList[a].boundarys[b].begin_x;
            }
        }

        console.debug("----- minBeginX: ", this.minBeginX, ", maxBeginX: ", this.maxBeginX);
        console.debug("----- minBeginY: ", this.minBeginY, ", maxBeginY: ", this.maxBeginY);
        console.debug("----- minEndX: ", this.minEndX, ", maxEndX: ", this.maxEndX);
        console.debug("----- minEndY: ", this.minEndY, ", maxEndY: ", this.maxEndY);
        console.debug("----- cnt: ", cnt, ", sum: ", sum, ", avg: ", sum / cnt);
        console.debug("----- this.lenx: ", this.maxBeginX - this.minBeginX, ", this.leny: ", this.maxBeginY - this.minBeginY);

        const height = 360;
        let intervalx = 0;
        const intervaly = 20;

        // X축의 최소최대와 Y축 좌표의 최소최대 비교, 더 큰값을 사용함.
        this.lenx = this.maxBeginX - this.minBeginX;
        this.leny = this.maxBeginY - this.minBeginY;
        // this.ratio = (this.lenx + this.leny) / 2 / height;
        this.ratio = (this.lenx > this.leny ? this.lenx : this.leny) / height;
        
        intervalx = (this.svgWidth - ((this.lenx > this.leny ? this.lenx : this.leny) / this.ratio)) / 2;

        this.correction[0] = intervalx;
        this.correction[1] = intervaly;

        // this.getLineGroup()
        //     .append('circle')
        //     .attr('id', 'cir')
        //     .attr('cx', 0)
        //     .attr('cy', 0)
        //     .attr('r', 5)
        //     .style('fill', 'steelblue')
        //     .style('opacity', 0.6);

        for (let a = 0; a < boundaryDataList.length; a++) {
            for (let b = 0; b < boundaryDataList[a].boundarys.length; b++) {
                gen = [
                    [
                        // (원본 좌표 - 모든 좌표중 최소좌표값) / 비율 - correction(고정값) + ((최대 좌표값 - 최소 좌표값) / 비율)
                        // (boundaryDataList[a].boundarys[b].begin_x - this.minBeginX) / this.ratio - this.correction[0] + ((this.maxBeginX - this.minBeginX) / this.ratio),
                        // (boundaryDataList[a].boundarys[b].begin_y - this.minBeginY) / this.ratio - this.correction[1] + ((this.maxBeginY - this.minBeginY) / this.ratio)
                        (boundaryDataList[a].boundarys[b].begin_x - this.minBeginX) / this.ratio + this.correction[0],
                        (boundaryDataList[a].boundarys[b].begin_y - this.minBeginY) / this.ratio + this.correction[1]
                    ],
                    [
                        // (boundaryDataList[a].boundarys[b].end_x - this.minEndX) / this.ratio - this.correction[0] + ((this.maxEndX - this.minEndX) / this.ratio),
                        // (boundaryDataList[a].boundarys[b].end_y - this.minEndY) / this.ratio - this.correction[1] + ((this.maxEndY - this.minEndY) / this.ratio)
                        (boundaryDataList[a].boundarys[b].end_x - this.minEndX) / this.ratio + this.correction[0],
                        (boundaryDataList[a].boundarys[b].end_y - this.minEndY) / this.ratio + this.correction[1]
                    ]
                ];

                let el = this.getLineGroup().append('path')
                    .attr('id', boundaryDataList[a].wallId + "_" + b)
                    .attr('d', lineObj(gen))
                    .attr("fill", "#787878")
                    .attr("stroke", "#787878")
                    .attr("stroke-width", 0.8)
            }
        }

        let parentThis = this;

        this.getSvgElement().on("click", function(event) {
            console.debug("click event: ", event);
            console.debug("x: ", parentThis.transform.x, ", y: ", parentThis.transform.y, ", k: ", parentThis.transform.k);
            console.debug("clientX: ", event.clientX, ", clientY: ", event.clientY);
            console.debug("layerX: ", event.layerX, ", layerY: ", event.layerY);
            console.debug("offsetX: ", event.offsetX, ", offsetY: ", event.offsetY);
            console.debug("pageX: ", event.pageX, ", pageY: ", event.pageY);
            console.debug("screenX: ", event.screenX, ", screenY: ", event.screenY);
            console.debug("x: ", event.x, ", y: ", event.y);
            console.debug("pointer: ", d3.pointer(event));

            const pointer = d3.pointer(event);
            
            const coords = parentThis.getTransformCoor(pointer);
            // const coords = topologyObj.getScreenCoords(pointer[0], pointer[1], [topologyObj.transform.x, topologyObj.transform.y], topologyObj.transform.k);
            console.debug(coords.x, coords.y); // shows coords relative to my svg container
            
            parentThis.drawDot(pointer, "pointer");

            parentThis.$scope.seiData.x = coords.x;
            parentThis.$scope.seiData.y = coords.y;
            parentThis.$scope.$apply();
        });

    }

    getTransformCoor(pointer) {
        return {
            // x: (pointer[0] - ((this.maxBeginX - this.minBeginX) / this.ratio) + this.correction[0]) * this.ratio + this.minBeginX,
            // y: (pointer[1] - ((this.maxBeginY - this.minBeginY) / this.ratio) + this.correction[1]) * this.ratio + this.minBeginY
            x: (pointer[0] - this.correction[0]) * this.ratio + this.minBeginX,
            y: (pointer[1] - this.correction[1]) * this.ratio + this.minEndY
        };
    }

    drawDot(pointer, type) {

        let cx = null;
        let cy = null;

        switch(type) {
            case "pointer":
                cx = pointer[0];
                cy = pointer[1];
                break;
            case "db":
                cx = (pointer[0] - this.minBeginX) / this.ratio + this.correction[0],
                cy = (pointer[1] - this.minEndY) / this.ratio + this.correction[1]
                break;
        }

        this.getLineGroup().selectAll('circle').remove();
        this.getLineGroup()
        .append('circle')
        .attr('id', 'clicked')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 5)
        .style('fill', 'steelblue')
        .style('opacity', 0.8);
    }

    getScreenCoords(x, y, translate, scale) {
        var xn = translate[0] + x*scale;
        var yn = translate[1] + y*scale;
        return { x: xn, y: yn };
    }

    initZoom() {
        // this.getSvgElement().call(this.zoom);
        // this.zoom.on("zoom", this.handleZoom);
    }

    handleZoom(e) {
        // console.debug("===== handleZoom, e: ", e);
        // topologyObj.getLineGroup()
        //     .attr("transform", e.transform);

        // topologyObj.transform.x = e.transform.x;
        // topologyObj.transform.y = e.transform.y;
        // topologyObj.transform.k = e.transform.k;
    }

    setZoom() {
        // this.getSvgElement().call(this.zoom.transform,
        //     d3.zoomIdentity.translate(topologyObj.orgTransform.x, topologyObj.orgTransform.y).scale(topologyObj.orgTransform.k));
    }

}


/**
 * 
 * Angular.js Controller단 사용법
 * 
    $scope.initTopology = function() {
        var width = angular.element("#topology-div")[0].offsetWidth;
        var height = angular.element("#topology-div")[0].offsetHeight;
        console.debug("offsetHeight: ", height);

        topologyObj = new TreeTopology("#topology-div", width, height);
        console.debug("divElement: ", topologyObj.getTopGroup());
        
        // let exData = $scope.exampleData;
        let exData = $scope.topologyData;

        let result = topologyObj.setNode(exData, $scope.ctx);

        if (result == 1) {
            $rootScope.alertOpen('warning', '고객사 정보가 2개 이상입니다.', false, true, 5000);
            return;
        } else if (result == 2) {
            $rootScope.alertOpen('warning', 'CSP 정보가 없습니다.', false, true, 5000);
            return;
        }
        
        topologyObj.setEdge(exData);
    }
 * 
 */
class TreeTopology {
    constructor(selector, width, height) {
        this.divElement = d3.select(selector);
        this.divElement.selectAll("*").remove();
        this.svgElement = this.divElement.append("svg")
            .attr("id", "svg")
            .style("width", "100%")
            .style("height", "100%");
        this.tooltipElementObj = {};
        this.legendElement = this.divElement.append("div")
            .attr("id", "legend")
            .style("position", "absolute")
            .style("top", "25px")
            .style("left", "25px");
        
        // set Link And Node And Dot Group
        this.svgElement.append("g").attr("id", "edges");
        this.svgElement.append("g").attr("id", "nodes");
        
        this.nodes = {};
        this.edges = {};

        this.svgWidth = width;
        this.svgHeight = height;
        this.yd = 150;

        // this.nodeSvgSize = {
        //     customer: {x: 100, y: 69.62},
        //     equip: {x: 90.26, y: 100},
        //     aws: {x: 98.9, y: 59.14},
        //     azure: {x: 117, y: 33.71},
        //     google: {x: 115.55, y: 52.76},
        //     panel: {x: 68.57, y: 70}
        // }

        this.nodeSvgSize = {
            customer: {x: 110, y: 110},
            equip: {x: 110, y: 110},
            aws: {x: 100, y: 100},
            azure: {x: 100, y: 100},
            google: {x: 100, y: 100},
            panel: {x: 70, y: 70},
        }

        this.nodeEllipse = {
            customer: {a: this.nodeSvgSize.customer.x / 2, b: this.nodeSvgSize.customer.y / 2},
            equip: {a: this.nodeSvgSize.equip.x / 2, b: this.nodeSvgSize.equip.y / 2},
            aws: {a: this.nodeSvgSize.aws.x / 2, b: this.nodeSvgSize.aws.y / 2},
            google: {a: this.nodeSvgSize.google.x / 2, b: this.nodeSvgSize.google.y / 2},
            azure: {a: this.nodeSvgSize.azure.x / 2, b: this.nodeSvgSize.azure.y / 2},
            panel: {a: this.nodeSvgSize.panel.x / 2, b: this.nodeSvgSize.panel.y / 2},
        }
        
    }

    getTopGroup() {
        return this.divElement;
    }

    getNodeGroup() {
        return this.svgElement.select("#nodes");
    }
    
    getEdgeGroup() {
        return this.svgElement.select("#edges");
    }

    getTooltipGroup() {
        return this.divElement.select("#tooltip");
    }

    getLegendGroup() {
        return this.divElement.select("#legend");
    }

    getNodeSvgIconUrl(type, ctx, switchType) {
        if (type.toLowerCase().includes("customer")) {
            return ctx + "/static/images/topology/icon_user.svg";
        } else if (type.toLowerCase().includes("equip")) {
            return this.getNodeSvgIconEquipType(switchType, ctx);
        } else if (type.toLowerCase().includes("aws")) {
            return ctx + "/static/images/topology/aws.svg";
        } else if (type.toLowerCase().includes("google")) {
            return ctx + "/static/images/topology/google_cloud.svg";
        } else if (type.toLowerCase().includes("azure")) {
            return ctx + "/static/images/topology/microsoft_azure.svg";
        } else if (type.toLowerCase().includes("panel")) {
            return ctx + "/static/images/topology/icon_patch.svg";
        } else {
            return ctx + "/static/images/topology/icon_patch.svg";
        }
    }

    getNodeSvgIconEquipType(switchType, ctx) {
        if (switchType.toLowerCase().includes("l2")) {
            return ctx + "/static/images/topology/icon_server.svg";
        } else if (switchType.toLowerCase().includes("l3")) {
            return ctx + "/static/images/topology/icon_server_l3.svg";
        } else {
            return ctx + "/static/images/topology/icon_server.svg";
        }
    }

    getNodeWidth(type) {
        if (type.toLowerCase().includes("customer")) {
            return this.nodeSvgSize.customer.x;
        } else if (type.toLowerCase().includes("equip")) {
            return this.nodeSvgSize.equip.x;
        } else if (type.toLowerCase().includes("aws")) {
            return this.nodeSvgSize.aws.x;
        } else if (type.toLowerCase().includes("google")) {
            return this.nodeSvgSize.google.x;
        } else if (type.toLowerCase().includes("azure")) {
            return this.nodeSvgSize.azure.x;
        } else if (type.toLowerCase().includes("panel")) {
            return this.nodeSvgSize.panel.x;
        } else {
            return 100;
        }
    }

    getNodeHeight(type) {
        if (type.toLowerCase().includes("customer")) {
            return this.nodeSvgSize.customer.y;
        } else if (type.toLowerCase().includes("equip")) {
            return this.nodeSvgSize.equip.y;
        } else if (type.toLowerCase().includes("aws")) {
            return this.nodeSvgSize.aws.y;
        } else if (type.toLowerCase().includes("google")) {
            return this.nodeSvgSize.google.y;
        } else if (type.toLowerCase().includes("azure")) {
            return this.nodeSvgSize.azure.y;
        } else if (type.toLowerCase().includes("panel")) {
            return this.nodeSvgSize.panel.y;
        } else {
            return 100;
        }
    }

    setEllipseAandB(type) {
        if (type.toLowerCase().includes("customer")) {
            return this.nodeEllipse.customer;
        } else if (type.toLowerCase().includes("equip")) {
            return this.nodeEllipse.equip;
        } else if (type.toLowerCase().includes("aws")) {
            return this.nodeEllipse.aws;
        } else if (type.toLowerCase().includes("google")) {
            return this.nodeEllipse.google;
        } else if (type.toLowerCase().includes("azure")) {
            return this.nodeEllipse.azure;
        } else if (type.toLowerCase().includes("panel")) {
            return this.nodeEllipse.panel;
        } else {
            return this.nodeEllipse.customer;
        }
    }

    /**
     * Init Tooltip Element
     * 
     * @param {*} linkId 
     */
    initTooltipElement(linkId) {
        this.tooltipElementObj['tooltip-' + linkId] = this.divElement.append("div")
            .attr("id", "tooltip")
            .attr("class", "ymtech_tooltip")
            .style("position", "absolute")
            .style("border", "1px solid #E3E3E8")
            .style("background", "#fff")
            .style("z-index", 10);
    }

    /**
     * set Coordinate Tooltip Element
     * 
     * @param {*} linkId 
     * @param {*} top 
     * @param {*} left 
     */
    setCoorTooltipElement(linkId, top, left) {
        this.tooltipElementObj['tooltip-' + linkId]
                                .style("top", top + "px")
                                .style("left",left + "px")
    }

    /**
     * Display Tooltip Element
     * 
     * @param {*} linkId 
     */
    displayTooltipElement(linkId) {
        this.tooltipElementObj['tooltip-' + linkId].style('display', 'block');
    }

    /**
     * Add Data Table Tooltip Element
     * 
     * @param {*} linkId 
     * @param {*} type 
     */
    addDataTableTooltipElement(linkId, customerId, type) {
        switch (type) {
            case "left":
                this.tooltipElementObj['tooltip-' + linkId].html(this.getTooltipLeftLineTemplate(this.edges[linkId]));
                break;
            case "right":
                this.tooltipElementObj['tooltip-' + linkId].html(this.getTooltipRightLineTemplate(this.edges[linkId]));
                break;
            case "dedicated":
                this.tooltipElementObj['tooltip-' + linkId].html(this.getTooltipDedicatedLineTemplate(linkId, this.edges[linkId].data));
                break;
            case "customer":
                this.tooltipElementObj['tooltip-' + linkId].html(this.getTooltipCustomerLineTemplate(linkId, this.nodes[customerId].data));
                break;
            default:
                this.tooltipElementObj['tooltip-' + linkId].html(this.getTooltipLeftLineTemplate(this.edges[linkId]));
                break;
        }
    }

    getTooltipLeftLineTemplate(linkData) {
        // console.debug("tooltip linkData: ", linkData);
        return `
        <div style="width:240px; padding: 12px;">
            <div class="table_head">
                <b>고객 정보</b>
                <div class="right">
                    <a class="btn_close" onclick="onClickCancelBtn('${linkData.id}');">닫기</a>
                </div>
            </div>
            <table class="lgu_table_read">
				<tr>
					<th style="width:40%">가입번호</th>
					<td>${this.nullCheck(linkData.data.entrNo)}</td>
				</tr>
				<tr>
					<th>전용회선번호</th>
					<td>${this.nullCheck(linkData.data.excsLineEntrNo)}</td>
				</tr>
				<tr>
					<th>회선속도</th>
					<td>${this.nullCheck(linkData.data.lineSped)}</td>
				</tr>
			</table>
        </div>`;
    }

    getTooltipRightLineTemplate(linkData) {
        // console.debug("linkData: ", linkData);
        return `
        <div style="width:300px; padding: 12px;">
           <div class="table_head">
               <b style="width: calc(100% - 26px);padding-bottom: 10px;">${this.nullCheck(linkData.data.name)} 정보</b>
               <div class="right">
                    <a class="btn_close" onclick="onClickCancelBtn('${linkData.id}');">닫기</a>
                </div>
           </div>
           <table class="lgu_table_read">
               <tr>
                   <th>Connection ID</th>
                   <td>${this.nullCheck(linkData.data.awsRltnProdCntn)}</td>
               </tr>
               <tr>
                   <th>연결속도</th>
                   <td>${this.nullCheck(linkData.data.lineSped)}</td>
               </tr>
               <tr>
                   <th>VLAN ID</th>
                   <td>${this.nullCheck(linkData.data.vlanId)}</td>
               </tr>
           </table>
        </div>`;
   }

   getTooltipDedicatedLineTemplate(linkId, data) {
        console.debug("data: ", data);
        return `
        <div style="width:300px; padding: 12px;">
            <div class="table_head">
                <b>Cloud 정보</b>
                <div class="right">
                        <a class="btn_close" onclick="onClickCancelBtn('${linkId}');">닫기</a>
                    </div>
            </div>
            <table class="lgu_table_read">
                <tr>
                    <th style="width:40%">클라우드사업자</th>
                    <td>${this.nullCheck(data.cloudEnpr)}</td>
                </tr>
                <tr>
                    <th>Connection ID</th>
                    <td>${this.nullCheck(data.awsRltnProdCntn)}</td>
                </tr>
                <tr>
                    <th>클라우드사업자 Rack</th>
                    <td>${this.nullCheck(data.awsRckNm)}</td>
                </tr>
                <tr>
                    <th>클라우드사업자 Path Panel</th>
                    <td>${this.nullCheck(data.awsPhpnNm)}</td>
                </tr>
                <tr>
                    <th>클라우드사업자 Port</th>
                    <td>${this.nullCheck(data.awsPhpnPrtNo)}</td>
                </tr>
            </table>
        </div>`;
    }

    getTooltipCustomerLineTemplate(linkId, data) {
        // console.debug("tooltip linkData: ", linkData);
        return `
        <div style="width:240px; padding: 12px;">
            <div class="table_head">
                <b>${this.nullCheck(data.name)} 정보</b>
                <div class="right">
                    <a class="btn_close" onclick="onClickCancelBtn('${linkId}');">닫기</a>
                </div>
            </div>
            <table class="lgu_table_read">
				<tr>
					<th style="width:40%">가입번호</th>
					<td>${this.nullCheck(data.entrNo)}</td>
				</tr>
				<tr>
					<th>전용회선번호</th>
					<td>${this.nullCheck(data.excsLineEntrNo)}</td>
				</tr>
				<tr>
					<th>회선속도</th>
					<td>${this.nullCheck(data.lineSped)}</td>
				</tr>
			</table>
        </div>`;
    }

    nullCheck(val) {
        return val != null ? val : "-";
    }

    /**
     * Node 좌표 제공
     * 
     * @param {*} lowData 
     * @param {*} ctx 
     * @returns 0: 정상, 1: 고객사 정보가 2개 이상, 2: csp 정보가 없을때
     */
    setNode(lowData, ctx) {

        if (lowData.data.csp.length == 0) {
            console.debug("CSP정보가 없습니다.");
            return 2;
        }

        let csps = lowData.data.csp;

        let allCspSumy = 0;
        let allCspCnt = 0;
        let allEquipSumy = {};

        let xMinus = 40;
        let interval = 50;

        // #1. CSP Node 좌표 설정
        let x = this.svgWidth / 4 * 3 - xMinus + interval + 20;
        let y = this.svgHeight / (csps.length + 1);
        let yd = y;
        for (const csp of csps) {
            csp.x = x;
            csp.y = y;
            csp.type = csp.data.type;
            this.nodes[csp.id] = csp;
            allCspSumy += y;
            allCspCnt++;
            y += yd;
        }

        // #2. 장비 Node 좌표 설정
        let equips = lowData.data.equip;
        x = this.svgWidth / 4 * 2 - xMinus;
        let sumy = 0;
        let cnt = 0;
        if (equips.length > 0) {
            for (const equip of equips) {
                csps.forEach(element => {
                    if (element.parent == equip.id) {
                        sumy += element.y;
                        cnt++;
                        if (allEquipSumy[equip.parent] == undefined) {
                            allEquipSumy[equip.parent] = {sumy: 0, cnt: 0};
                        }
                        allEquipSumy[equip.parent].sumy += element.y;
                        allEquipSumy[equip.parent].cnt++;
                    }
                });
                equip.x = x;
                equip.y = sumy / cnt;
                equip.type = "equip";
                this.nodes[equip.id] = equip;
                sumy = 0;
                cnt = 0;
            }
        }

        // #3. Customer Node 좌표 설정
        let customers = lowData.data.customer;
        x = this.svgWidth / 4 - xMinus - interval;
        if (equips.length > 0) {
            for (const customer of customers) {
                customer.x = x;
                customer.y = allEquipSumy[customer.id].sumy / allEquipSumy[customer.id].cnt;
                customer.type = "customer";
                this.nodes[customer.id] = customer;
            }
        } else {
            if (customers.length == 1) {
                for (const customer of customers) {
                    customer.x = x;
                    customer.y = allCspCnt == 0 ? y : allCspSumy / allCspCnt;
                    customer.type = "customer";
                    this.nodes[customer.id] = customer;
                }
            } else {
                // console.debug("고객사 정보가 2개 이상입니다.");
                return 1;
            }
        }

        // #4. Node svg 그리기
        let parentThis = this;
        let svgPromise = [];
        for (const nodeId in this.nodes) {
            svgPromise.push(d3.svg(this.getNodeSvgIconUrl(this.nodes[nodeId].type, ctx, this.nodes[nodeId].data.type))
                .then(function(data) {
                    parentThis.getNodeGroup().append(() => data.documentElement)
                        .attr("id", "node_" + parentThis.nodes[nodeId].id);

                    let element = d3.select("#" + "node_" + parentThis.nodes[nodeId].id);

                    element.attr("width", parentThis.getNodeWidth(parentThis.nodes[nodeId].type))
                           .attr("height", parentThis.getNodeHeight(parentThis.nodes[nodeId].type))

                    // Node Element x,y 결정
                    // element.attr("x", parentThis.nodes[nodeId].x - (parentThis.nodes[nodeId].type.toLowerCase().includes("customer") || parentThis.nodes[nodeId].type.toLowerCase().includes("equip") ? 50 : 50))
                    //        .attr("y", parentThis.nodes[nodeId].y - (parentThis.nodes[nodeId].type.toLowerCase().includes("google") ? 30 : 50))
                    element.attr("x", parentThis.nodes[nodeId].x - parentThis.getNodeWidth(parentThis.nodes[nodeId].type) / 2)
                           .attr("y", parentThis.nodes[nodeId].y - (parentThis.getNodeHeight(parentThis.nodes[nodeId].type) -
                                        (parentThis.nodes[nodeId].type.toLowerCase().includes("customer") || parentThis.nodes[nodeId].type.toLowerCase().includes("equip") ? 27 : 0)) / 2)
                    parentThis.nodes[nodeId].element = element;
            }));
        }

        console.debug("coordinate Node Result: ", this.nodes);
        return 0;
    }

    setEdge(lowData) {
        let links = lowData.link;

        let gen =[];
        let lineObj = d3.line();

        let parentThis = this;

        for (const link of links) {

            // Link별 click 플래그 정의
            link.isClick = false;

            if (link.type.toLowerCase() == "shared") {

                const fromGen = this.setPosition(this.nodes[link.from], this.nodes[link.to]);
                const toGen = this.setPosition(this.nodes[link.to], this.nodes[link.from]);
                console.debug("fromGen: ", fromGen, ", toGen: ", toGen);

                // gen = [[this.nodes[link.from].x, this.nodes[link.from].y], [this.nodes[link.to].x, this.nodes[link.to].y]];
                gen = [[fromGen.x, fromGen.y], [toGen.x, toGen.y]];
    
                let showElement = this.getEdgeGroup().append('path')
                    .attr('id', "tmp_" + link.id)
                    .attr('d', lineObj(gen))
                    .attr("fill", "#787878")
                    .attr("stroke", "#787878")
                    .attr("stroke-width", 2);

                let edgeElement = this.getEdgeGroup().append('path')
                    .attr('id', link.id)
                    .attr('d', lineObj(gen))
                    .attr("fill", "#787878")
                    .attr("stroke", "#787878")
                    .style("opacity", 0)
                    .attr("stroke-width", 20);

                // 해당 Link의 from, to중 Customer인 Node가 존재하는 left Link, 아니라면 right Link
                if (this.nodes[link.from].type == "customer" || this.nodes[link.to].type == "customer") {
                    link.position = "left";
                } else {
                    link.position = "right";
                }

                // link Data 저장
                this.edges[link.id] = link;
                this.edges[link.id].element = edgeElement;

                // Edge Tooltip 기능
                edgeElement
                .on("mouseover", function(event) {

                    // console.debug("mouseover !! ");
                    let current = d3.select(this);

                    showElement.attr("stroke", "#00FFCC")
                        .attr("stroke-width", 8);

                    // #1. left link 일때
                    if (parentThis.edges[current.attr("id")].position == "left") {
                        // #1-1.해당 Tooltip Element가 없을때만 새로 생성
                        if (parentThis.tooltipElementObj['tooltip-' + current.attr("id")] == undefined) {
                            parentThis.initTooltipElement(current.attr("id"));
                            parentThis.displayTooltipElement(current.attr("id"));
                            parentThis.addDataTableTooltipElement(current.attr("id"), null, parentThis.edges[current.attr("id")].position);
                        }
                    // #2. right link 일때
                    } else {

                        // #2-1. 해당 line에 연결된 Node를 칮고, Node와 연결된 line중 customer와 연결된 Edge를 찾는다.
                        let findCustomerEdge = parentThis.findCustomerEdgeByConnectedSelectedEdge(current.attr("id"), lowData.data.equip.length);

                        // #2-2. 오른쪽 line에 hover시, 왼쪽 툴팁도 보여야한다.
                        if (findCustomerEdge != null && parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id] == undefined) {
                            d3.select("#tmp_" + findCustomerEdge.id).attr("stroke", "#00FFCC")
                                .attr("stroke-width", 8);
                            parentThis.initTooltipElement(findCustomerEdge.id);
                            parentThis.displayTooltipElement(findCustomerEdge.id);
                            parentThis.setCoorTooltipElement(findCustomerEdge.id //
                                , (parentThis.nodes[findCustomerEdge.from].y + parentThis.nodes[findCustomerEdge.to].y) / 2 //
                                , (parentThis.nodes[findCustomerEdge.from].x));
                                // , (parentThis.nodes[findCustomerEdge.from].x + parentThis.nodes[findCustomerEdge.to].x) / 2);
                            parentThis.addDataTableTooltipElement(findCustomerEdge.id, null, "left");
                        }

                        // #2-3.해당 Tooltip Element가 없을때만 새로 생성
                        if (parentThis.tooltipElementObj['tooltip-' + current.attr("id")] == undefined) {
                            parentThis.initTooltipElement(current.attr("id"));
                            parentThis.displayTooltipElement(current.attr("id"));
                            parentThis.addDataTableTooltipElement(current.attr("id"), null, parentThis.edges[current.attr("id")].position);
                        }
                        
                    }
                })
                .on("mousemove", function(event) {
                    // console.debug("mousemove !! ");
                    let current = d3.select(this);

                    if (parentThis.edges[current.attr("id")].isClick) {
                        return;
                    }
                    
                    return parentThis.tooltipElementObj['tooltip-' + current.attr("id")]
                        .style("top", (event.offsetY + 14)+"px")
                        .style("left",(event.offsetX + 14)+"px");
                })
                .on("mouseout", function(event) {
                    // console.debug("mouseout !! ");
                    let current = d3.select(this);

                    showElement.attr("stroke", "#787878")
                        .attr("stroke-width", 2);
                    
                    // #1-1. 해당 line에 연결된 Node를 칮고, Node와 연결된 line중 customer와 연결된 Edge를 찾는다.
                    let findCustomerEdge = parentThis.findCustomerEdgeByConnectedSelectedEdge(current.attr("id"), lowData.data.equip.length);

                    if (parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id] != undefined && !findCustomerEdge.isClick) {
                        d3.select("#tmp_" + findCustomerEdge.id).attr("stroke", "#787878")
                                .attr("stroke-width", 2);
                        parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id].remove();
                        delete parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id];
                    }

                    if (parentThis.tooltipElementObj['tooltip-' + current.attr("id")] != undefined && !parentThis.edges[current.attr("id")].isClick) {
                        parentThis.tooltipElementObj['tooltip-' + current.attr("id")].remove();
                        delete parentThis.tooltipElementObj['tooltip-' + current.attr("id")];
                    }

                    return;
                })
                .on("click", function(event) {
                    let current = d3.select(this);
                    parentThis.edges[current.attr("id")].isClick = true;

                    return;
                });

            // 해당 Link의 type이 dedicated 일때는 무조건 CSP에 연결되어 있는 회선임.
            } else if (link.type.toLowerCase() == "dedicated") {

                // Dedicated 방식일때 중간에 Panel Node가 추가됨
                d3.svg(this.getNodeSvgIconUrl("panel", ctx, null))
                .then(function(data) {

                    let fromNode = parentThis.nodes[link.from];
                    let toNode = parentThis.nodes[link.to];

                    let panelId = "panel_" + fromNode.id + "__" + toNode.id;

                    parentThis.getNodeGroup().append(() => data.documentElement)
                        .attr("id", panelId);

                    let element = d3.select("#" + panelId);

                    element.attr("width", parentThis.getNodeWidth("panel"))
                           .attr("height", parentThis.getNodeHeight("panel"))

                    // Node Element x,y 결정
                    let panelx = fromNode.type == "equip" || toNode.type == "equip" ? (fromNode.x + toNode.x) / 2 : ((fromNode.x + toNode.x) / 2 + toNode.x) / 2;
                    let panely = toNode.y;
                    element.attr("x", panelx - parentThis.getNodeWidth("panel") / 2)
                           .attr("y", panely - parentThis.getNodeHeight("panel") / 2);
                    
                    parentThis.nodes[panelId] = {
                        id: panelId,
                        parent: null,
                        data: null,
                        x: panelx,
                        y: panely,
                        type: "panel"
                    };
                    parentThis.nodes[panelId].element = element;

                    const leftFromGen = parentThis.setPosition(fromNode, parentThis.nodes[panelId]);
                    const leftToGen = parentThis.setPosition(parentThis.nodes[panelId], fromNode);
                    const rightFromGen = parentThis.setPosition(parentThis.nodes[panelId], toNode);
                    const rightToGen = parentThis.setPosition(toNode, parentThis.nodes[panelId]);

                    // let panelFromGen = [[fromNode.x, fromNode.y], [panelx, panely]];
                    // let panelToGen = [[panelx, panely], [toNode.x, toNode.y]];
                    let panelFromGen = [[leftFromGen.x, leftFromGen.y], [leftToGen.x, leftToGen.y]];
                    let panelToGen = [[rightFromGen.x, rightFromGen.y], [rightToGen.x, rightToGen.y]];

                    parentThis.getEdgeGroup().append('path')
                        .attr('id', "tmp_panel_link_" + fromNode.id + "_" + panelId)
                        .attr('d', lineObj(panelFromGen))
                        .attr("fill", "#787878")
                        .attr("stroke", "#787878")
                        .attr("stroke-width", 2);

                    let panelFromEdgeElement = parentThis.getEdgeGroup().append('path')
                        .attr('id', "panel_link_" + fromNode.id + "_" + panelId)
                        .attr('d', lineObj(panelFromGen))
                        .attr("fill", "#787878")
                        .attr("stroke", "#787878")
                        .style("opacity", 0)
                        .attr("stroke-width", 20);

                    parentThis.getEdgeGroup().append('path')
                        .attr('id', "tmp_panel_link_" + panelId + "_" + toNode.id)
                        .attr('d', lineObj(panelToGen))
                        .attr("fill", "#787878")
                        .attr("stroke", "#787878")
                        .attr("stroke-width", 2);
    
                    let panelToEdgeElement = parentThis.getEdgeGroup().append('path')
                        .attr('id', "panel_link_" + panelId + "_" + toNode.id)
                        .attr('d', lineObj(panelToGen))
                        .attr("fill", "#787878")
                        .attr("stroke", "#787878")
                        .style("opacity", 0)
                        .attr("stroke-width", 20);

                    parentThis.edges["panel_link_" + fromNode.id + "_" + panelId] = link;
                    parentThis.edges["panel_link_" + panelId + "_" + toNode.id] = link;
                    parentThis.edges["panel_link_" + fromNode.id + "_" + panelId].element = panelFromEdgeElement;
                    parentThis.edges["panel_link_" + panelId + "_" + toNode.id].element = panelToEdgeElement;

                    // panel_link_customer1_panel_customer1_csp1
                    // panel_link_panel_customer1_csp1_csp1

                    // Edge Tooltip 기능
                    for (const edgeElement of [panelFromEdgeElement, panelToEdgeElement]) {
                        edgeElement
                        .on("mouseover", function(event) {
                            let current = d3.select(this);

                            console.debug("current.attr: ", current.attr("id"));

                            d3.select("#tmp_" + current.attr("id")).attr("stroke", "#00FFCC")
                                .attr("stroke-width", 8);

                            // #2-1. 해당 line에 연결된 Node를 칮고, Node와 연결된 line중 customer와 연결된 Edge를 찾는다.
                            let findCustomerEdge = parentThis.findCustomerEdgeByConnectedSelectedEdge(current.attr("id"), lowData.data.equip.length);

                            // #2-2. 오른쪽 line에 hover시, 왼쪽 툴팁도 보여야한다.
                            if (lowData.data.equip.length > 0) {
                                if (findCustomerEdge != null && parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id] == undefined) {
                                    d3.select("#tmp_" + "panel_link_" + fromNode.id + "_" + panelId).attr("stroke", "#00FFCC")
                                        .attr("stroke-width", 8);
                                    parentThis.initTooltipElement(findCustomerEdge.id);
                                    parentThis.displayTooltipElement(findCustomerEdge.id);
                                    parentThis.setCoorTooltipElement(findCustomerEdge.id //
                                        , (parentThis.nodes[findCustomerEdge.from].y) //
                                        // , (parentThis.nodes[findCustomerEdge.from].y + parentThis.nodes[findCustomerEdge.to].y) / 2 //
                                        , (parentThis.nodes[findCustomerEdge.from].x));
                                        // , (parentThis.nodes[findCustomerEdge.from].x + parentThis.nodes[findCustomerEdge.to].x) / 2);
                                    parentThis.addDataTableTooltipElement(findCustomerEdge.id, null, "left");
                                }
                            } else {
                                if (findCustomerEdge != null && parentThis.tooltipElementObj['tooltip-' + "panel_link_" + fromNode.id + "_" + panelId] == undefined) {
                                    d3.select("#tmp_" + "panel_link_" + fromNode.id + "_" + panelId).attr("stroke", "#00FFCC")
                                        .attr("stroke-width", 8);
                                    parentThis.initTooltipElement("panel_link_" + fromNode.id + "_" + panelId);
                                    parentThis.displayTooltipElement("panel_link_" + fromNode.id + "_" + panelId);
                                    parentThis.setCoorTooltipElement("panel_link_" + fromNode.id + "_" + panelId //
                                        , (parentThis.nodes[findCustomerEdge.from].y) //
                                        // , (parentThis.nodes[findCustomerEdge.from].y + parentThis.nodes[panelId].y) / 2 //
                                        , (parentThis.nodes[findCustomerEdge.from].x));
                                        // , (parentThis.nodes[findCustomerEdge.from].x + parentThis.nodes[panelId].x) / 2);
                                    parentThis.addDataTableTooltipElement("panel_link_" + fromNode.id + "_" + panelId, findCustomerEdge.from, "customer");
                                }
                            }

                            // #2-3.해당 Tooltip Element가 없을때만 새로 생성
                            if (parentThis.tooltipElementObj['tooltip-' + current.attr("id")] == undefined) {
                                parentThis.initTooltipElement(current.attr("id"));
                                parentThis.displayTooltipElement(current.attr("id"));
                                parentThis.addDataTableTooltipElement(current.attr("id"), null, "dedicated");
                            }

                            return;
                        })
                        .on("mousemove", function(event) {
                            let current = d3.select(this);

                            console.debug("current.attr: ", current.attr("id"));
                            if (parentThis.edges[current.attr("id")].isClick) {
                                return;
                            }
                            
                            return parentThis.tooltipElementObj['tooltip-' + current.attr("id")]
                                .style("top", (event.offsetY + 14)+"px")
                                .style("left",(event.offsetX + 14)+"px");
                        })
                        .on("mouseout", function(event) {
                            let current = d3.select(this);
                    
                            d3.select("#tmp_" + current.attr("id")).attr("stroke", "#787878")
                                        .attr("stroke-width", 2);

                            // #1-1. 해당 line에 연결된 Node를 칮고, Node와 연결된 line중 customer와 연결된 Edge를 찾는다.
                            let findCustomerEdge = parentThis.findCustomerEdgeByConnectedSelectedEdge(current.attr("id"), lowData.data.equip.length);

                            // console.debug("----- findCustomerEdge: ", findCustomerEdge);

                            if (lowData.data.equip.length > 0) {
                                if (parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id] != undefined && !findCustomerEdge.isClick) {
                                    d3.select("#tmp_" + "panel_link_" + fromNode.id + "_" + panelId).attr("stroke", "#787878")
                                        .attr("stroke-width", 2);
                                    parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id].remove();
                                    delete parentThis.tooltipElementObj['tooltip-' + findCustomerEdge.id];
                                }
                            } else {
                                if (parentThis.tooltipElementObj['tooltip-' + "panel_link_" + fromNode.id + "_" + panelId] != undefined && !findCustomerEdge.isClick) {
                                    d3.select("#tmp_" + "panel_link_" + fromNode.id + "_" + panelId).attr("stroke", "#787878")
                                        .attr("stroke-width", 2);
                                    parentThis.tooltipElementObj['tooltip-' + "panel_link_" + fromNode.id + "_" + panelId].remove();
                                    delete parentThis.tooltipElementObj['tooltip-' + "panel_link_" + fromNode.id + "_" + panelId];
                                }
                            }

                            if (parentThis.tooltipElementObj['tooltip-' + current.attr("id")] != undefined && !parentThis.edges[current.attr("id")].isClick) {
                                parentThis.tooltipElementObj['tooltip-' + current.attr("id")].remove();
                                delete parentThis.tooltipElementObj['tooltip-' + current.attr("id")];
                            }
                            
                            return;
                        })
                        .on("click", function(event) {
                            let current = d3.select(this);
                            parentThis.edges[current.attr("id")].isClick = true;
        
                            return;
                        });
                    }
                });
            }

        }

        console.debug("coordinate Edge Result: ", this.edges);
    }

    /**
     * 해당 Edge ID에 연결된 Equip Node를 찾은 후 해당 Equip Node와 Customer Node간에 연결된 Edge를 찾는다.
     * 
     * @param {*} selectedEdgeId 
     * @returns 
     */
    findCustomerEdgeByConnectedSelectedEdge(selectedEdgeId, equipCnt) {
        let findNode = null;

        if (this.nodes[this.edges[selectedEdgeId].from].type == "equip") {
            findNode = this.nodes[this.edges[selectedEdgeId].from];
        } else if (this.nodes[this.edges[selectedEdgeId].to].type == "equip") {
            findNode = this.nodes[this.edges[selectedEdgeId].to];
        }

        if (findNode == null) {

            // 여기서, 바로 연결된 equip Node가 없을경우에 customer Node를 찾고, 만약 존재한다면 해당 Link는 csp와 customer를 연결한 Link 정보임.
            if (this.nodes[this.edges[selectedEdgeId].from].type == "customer") {
                findNode = this.nodes[this.edges[selectedEdgeId].from];
            } else if (this.nodes[this.edges[selectedEdgeId].to].type == "customer") {
                findNode = this.nodes[this.edges[selectedEdgeId].to];
            }
    
            // return findNode;
        }
        
        // console.debug("find findNode: ", findNode);

        for (const edgeId in this.edges) {
            let edge = this.edges[edgeId];
            if (equipCnt > 0) {
                if ((this.nodes[edge.from].type == "customer" || this.nodes[edge.to].type == "customer")
                    && edge.from == findNode.id || edge.to == findNode.id) {
                    // console.debug("find customer link: ", edge);
                    return edge;
                }
            } else {
                return this.edges[selectedEdgeId];
            }
        }

        return null;
    }

    setPosition(sourceNodeObj, targetNodeObj) {
 
        // #1. 두 노드 사이의 기을기값을 결정 한 후, Edge 데이터 모델에 결정한 Edge 꼭지점 좌표값 저장
        const sourceNodex = sourceNodeObj.x;
        const sourceNodey = sourceNodeObj.y;
        const targetNodex = targetNodeObj.x;
        const targetNodey = targetNodeObj.y;
    
        // (a, b), (c, d) => (0, 0), (x, y)로 변경
        let x1 = sourceNodex + sourceNodex * -1;
        let y1 = sourceNodey + sourceNodey * -1;
        let x2 = targetNodex + sourceNodex * -1;
        let y2 = (targetNodey + sourceNodey * -1) * -1;
    
        // let distance = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
        // let widthSum = sourceNodeObj.width / 2 + targetNodeObj.width / 2;
        // console.debug("Node distance: ", distance, ", width sum: ", widthSum);
        
        // if (distance <  widthSum && !isInit) {
        // 	edgeObj.element
        // 		.attr("display", "none");
        // 	topologyObj.getDot(edgeId + "_" + type).element
        // 		.attr("display", "none")
        // 	return;
        // } else if (!distance < widthSum && !isInit) {
        // 	edgeObj.element
        // 		.attr("display", "unset");
        // 	topologyObj.getDot(edgeId + "_" + type).element
        // 		.attr("display", "unset")
        // }
    
        /**
         * ------------------------------------------------------------------------------------------------
         * ----- START : 기존 꼭지점 로직 - 상하좌우 4등분 결정
         * ------------------------------------------------------------------------------------------------
         */
        // let degree = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // 두 노드 사이의 각도(source Node를 0,0으로 이동시켰을때의 각도)
    
        // // 해당 부분은 기울기값이 1일때 오차를 주기 위한 부분임.
        // degree = degree == 45 ? 46 : degree;
        // degree = degree == 135 ? 134 : degree;
        // degree = degree == -45 ? -46 : degree;
        // degree = degree == -135 ? -134 : degree;
    
    
        // let selectedType = null;
    
        // // Edge 꼭지점 좌표값 저장
        // if (45 < degree && degree <= 135) {
        // 	selectedType = "top";
        // 	edgeObj[type + "x"] = sourceNodex + topologyObj.getFineTuning()[sourceNodeObj.type][selectedType];
        // 	edgeObj[type + "y"] = sourceNodey - sourceNodeObj.height / 2;
        // } else if (-45 < degree && degree <= 45) {
        // 	selectedType = "right";
        // 	edgeObj[type + "x"] = sourceNodex + sourceNodeObj.width / 2 + topologyObj.getFineTuning()[sourceNodeObj.type][selectedType];
        // 	edgeObj[type + "y"] = sourceNodey;
        // } else if (-135 < degree && degree <= -45) {
        // 	selectedType = "bottom";
        // 	edgeObj[type + "x"] = sourceNodex + topologyObj.getFineTuning()[sourceNodeObj.type][selectedType];
        // 	edgeObj[type + "y"] = sourceNodey + sourceNodeObj.height / 2 + topologyObj.getFineTuning()[sourceNodeObj.type][selectedType] + 3;
        // } else if (degree <= -135 || degree > 135 ) {
        // 	selectedType = "left";
        // 	edgeObj[type + "x"] = sourceNodex - sourceNodeObj.width / 2 + topologyObj.getFineTuning()[sourceNodeObj.type][selectedType];
        // 	edgeObj[type + "y"] = sourceNodey;
        // }
        // console.debug("type: ", type, ", ( ", x1, ", ", y1, " ), ( ", x2, ", ", y2, " ), degree: ", degree, ", selectedType: ", selectedType, ", edgeObj: ", edgeObj);
        /**
         * ------------------------------------------------------------------------------------------------
         * ----- E N D : 기존 꼭지점 로직 - 상하좌우 4등분 결정
         * ------------------------------------------------------------------------------------------------
         */
    
        /**
         * ------------------------------------------------------------------------------------------------
         * ----- START : 신규 Edge 꼭지점 좌표결정 로직 - 원과 직선사이의 교점
         * ------------------------------------------------------------------------------------------------
         */
        let sl = equationStraightLine(x1, y1, x2, y2); // 직선의방정식 구하기
        // console.debug("a: ", sl.a, ", b: ", sl.b, ", c: ", sl.c);
        // let iplc = new IntersectPointsOfLineCircle(sl.a, sl.b, sl.c, 0, 0, sourceNodeObj.width / 2); // 원과 직선의 교점 구하기
        // let iplc = new IntersectPointsOfLineEllipse(sl.a, sl.b, sl.c, sourceNodeObj.width / 2, sourceNodeObj.height / 2); // 타원과 직선의 교점 구하기
        let iplc = new IntersectPointsOfLineEllipse(sl.a, sl.b, sl.c, this.setEllipseAandB(sourceNodeObj.type).a, this.setEllipseAandB(sourceNodeObj.type).b); // 타원과 직선의 교점 구하기
        let resCircleCoor = distanceFromPointToPoint(x2, y2, iplc); // 점과 점 사이의 거리 구하기
        // console.debug("------------------------------------------------------------------------------------");
        // console.debug("sourceNodeObj: ", sourceNodeObj, ", targetNodeObj: ", targetNodeObj);
        // console.debug("equationStraightLine Result: ", sl, ", Result: ", iplc);
        // console.debug("resCircleCoor Result: ", resCircleCoor);
        // console.debug("------------------------------------------------------------------------------------");
    
        // Edge 꼭지점 좌표값 저장
        const result = {x: sourceNodex + resCircleCoor.x //
                      , y: sourceNodey - resCircleCoor.y};
        /**
         * ------------------------------------------------------------------------------------------------
         * ----- E N D : 신규 Edge 꼭지점 좌표결정 로직 - 원과 직선사이의 교점
         * ------------------------------------------------------------------------------------------------
         */
        return result;
    }

}

/**
 * Tooltip Cancel 버튼 클릭
 * 
 * @param {*} linkId 
 */
function onClickCancelBtn(linkId) {
    console.debug("click event !!!, topologyObj: ", topologyObj.tooltipElementObj['tooltip-' + linkId]);
    topologyObj.edges[linkId].isClick = false;
    topologyObj.tooltipElementObj['tooltip-' + linkId].remove();
    delete topologyObj.tooltipElementObj['tooltip-' + linkId];
}

/**
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ===== E N D : d3 - Tree
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 * ----------------------------------------------------------------------------------------------------------
 */