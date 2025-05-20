// 初始化景点图标对象
const scnicon3={
    type:"image",
    image:"img/scn3.png",
    size:[14,14], // 图片尺寸
    anchor: 'center'
}

const scnicon4={
    type:"image",
    image:"img/scn4.png",
    size:[16,16], // 图片尺寸
    anchor: 'center'
}

const scnicon5={
    type:"image",
    image:"img/scn5.png",
    size:[36,36], // 图片尺寸
    anchor: 'center'
}

function show_path(path){
    path_str(path)
    path_map(path)
}

// 显示文本的路径
function path_str(path){
    place = document.getElementById("final_path")
    place.setAttribute("class","show")
    html_str = `
    <table id='path_table'>
        <thead>
            <th>沿途站点</th>
            <th>所用时间</th>
        </thead>
        <tbody>
    `
    // 输出每个站点
    for(i= 0;i<path.length;i++){
        html_str += `
        <tr>
            <td>${path[i].name}</td>
            <td>${min_to_h(time_list[path[i].id])}</td>
            <td><button id=btn_switch_${path[i].id} onclick = "switch_table(this.id)">移至站点</button><td>
        </tr>
        <tr>
            <td colspan='3'>
                <div>
        `
        // 无数据
        table_str_n = `
                    <table id='scenery_${path[i].id}' class='hide'>
                    <tbodyid='tbd_${path[i].id}>
        `
        // 有数据
        table_str_y = `
                    <table id='scenery_${path[i].id}' class='hide'>
                    <thead id='head_${path[i].id}'>    
                            <th>景点等级</th>
                            <th>景点名称</th>
                            <th>所需时间</th>
                        </thead>
                        <tbody id='tbd_${path[i].id}'>
        `

        this_station = path[i]
        // 筛选合适的景点
        fit_scenery_num = 0
        for(j = 0;j<this_station.near_scenery.length;j++){
            level = this_station.near_scenery[j].slice(0,1)
            spend_time = this_station.scenery_time[j]
            if(level == 3 & value_3A != '0' & spend_time <= Number(max_time)*60){
                // 3A景点权重不为0且所用时间小于设置时间
                fit_scenery_num++
                table_str_y += `
                    <tr>
                        <td>3A</td>
                        <td>${this_station.scenery_name[j]}</td>
                        <td>${min_to_h(spend_time/60)}</td>
                    </tr>
                `
                
                // 添加景点和站点到景点的直线


            }
            else if(level == 4 & value_4A != '0'& spend_time <= Number(max_time)*60){
                // 4A景点权重不为0
                fit_scenery_num++
                table_str_y += `
                    <tr>
                        <td>4A</td>
                        <td>${this_station.scenery_name[j]}</td>
                        <td>${min_to_h(spend_time/60)}</td>
                    </tr>
                `
            }
            else if(level == 5 & value_5A != '0'& spend_time <= Number(max_time)*60){
                // 5A景点权重不为0
                fit_scenery_num++
                table_str_y += `
                    <tr>
                        <td>5A</td>
                        <td>${this_station.scenery_name[j]}</td>
                        <td>${min_to_h(spend_time/60)}</td>
                    </tr>
                `
            }
        }
        // 无合适景点时显示该站点无景点
        if(fit_scenery_num == 0){
            // 隐藏表格头
            table_str_n += `
                <td colspan='3'>该站点在现有条件下无邻近景点</td>
            `
            html_str += table_str_n
        }
        else{
            html_str += table_str_y
        }

        html_str += `
                                </tbody>
                                        </table>

                                    </div>
                                </td>
                            </tr>`
    }
    html_str += `
    </tbody>
    </table>
    `
    place.innerHTML = html_str
}


// 切换表格是否显示
function switch_table(btn_id){
    stationid = String(btn_id).slice(11)
    if(document.getElementById(btn_id).innerHTML == "返回"){
        // 隐藏景点
        document.getElementById(btn_id).innerHTML = "移至站点"
        document.getElementById(`scenery_${stationid}`).setAttribute("class","hide")
        // 返回整个路径
        map.setFitView(allscnpolyline,false,[120,120,120,240])

    }
    else{
        // 显示站点
        document.getElementById(btn_id).innerHTML = "返回"
        document.getElementById(`scenery_${stationid}`).setAttribute("class","show")
                // 移动地图到该站点
        map.setZoomAndCenter(
            10,
            [Number(station_data[id_to_index(stationid)].Lng),
            Number(station_data[id_to_index(stationid)].Lat)],
            false,
        )
    }


}

// 显示地图中的路径
function path_map(path){
    // 清除先前线路
    map.remove(pathLayer)
    pathLayer = new AMap.VectorLayer({
        zIndex:20,
    });
    map.add(pathLayer)

    // 清除先前景点
    map.remove(scnPathLayer)
    scnPathLayer = new AMap.VectorLayer({
        zIndex:15,
    })
    map.add(scnPathLayer)

    map.remove(scnLabelsLayer)
    scnLabelsLayer = new AMap.LabelsLayer({
        zooms:[6,20],  // 设置显示范围
        zIndex:16,  // 绘制顺序
        collision: true, // 层内标注避让
        allowCollision: false,// 不同层标注避让
    })

    // 添加新的线路
    pathList = []
    for(path_i = 0;path_i < path.length; path_i++){
        pathList.push(new AMap.LngLat(path[path_i].Lng,path[path_i].Lat))
    }
    allscnpolyline = new AMap.Polyline({
        path:pathList,
        zIndex:18, 
        strokeWeight: 8, //线条宽度
        strokeColor: "red", //线条颜色
        lineJoin: "round", //折线拐点连接处样式
        strokeOpacity: 1,
        showDir:true,
    })
    pathLayer.add(allscnpolyline)
    map.setFitView(allscnpolyline,false,[120,120,120,240])

    //添加新的景点
    for(scn_i = 0;scn_i <path.length;scn_i++){
        this_station = path[scn_i]
        sLng = this_station.Lng
        sLat = this_station.Lat
        if(this_station.near_scenery.length != 0){
            for(scn_j = 0;scn_j<this_station.near_scenery.length;scn_j++){

                level = this_station.near_scenery[scn_j].slice(0,1)
                // 判断是否应该添加
                badd = false
                if(level == 3 & value_3A != '0' & 
                    Number(this_station.scenery_time[scn_j]) <= Number(max_time)*60){
                        badd = true
                    }
                if(level == 4 & value_4A != '0' & 
                    Number(this_station.scenery_time[scn_j]) <= Number(max_time)*60){
                        badd = true
                    }
                if(level == 5 & value_5A != '0' & 
                    Number(this_station.scenery_time[scn_j]) <= Number(max_time)*60){
                        badd = true
                    }

                if(badd){
                    scnLng = Number(this_station.scenery_Lng[scn_j])
                    scnLat = Number(this_station.scenery_Lat[scn_j])
                    level = this_station.near_scenery[scn_j].slice(0,1)
                    scnName = this_station.scenery_name[scn_j]

                    // 添加景点
                    const text={
                        content: level + "A:" +  scnName,
                        direction: "right",
                        offset:[0,0], // 偏移方向

                        style:{
                            fontSize: 12, //字体大小    
                            fillColor: "#111111", //字体颜色
                            strokeColor: "#fff", //描边颜色
                            strokeWidth: 2, //描边宽度
                            },
                            zIndex:120,
                    }

                    if(level == 3)
                    {
                        labelmarker = new AMap.LabelMarker({
                            name:'标注',
                            position: new AMap.LngLat(scnLng,scnLat),
                            zIndex:120,
                            rank:1, // 优先避让级
                            icon:scnicon3,
                            text:text,
                        })
                    }
                    else if(level == 4) {
                        labelmarker = new AMap.LabelMarker({
                            name:'标注',
                            position: new AMap.LngLat(scnLng,scnLat),
                            zIndex:120,
                            rank:1, // 优先避让级
                            icon:scnicon4,
                            text:text,
                        })
                    }
                    else {
                        labelmarker = new AMap.LabelMarker({
                            name:'标注',
                            position: new AMap.LngLat(scnLng,scnLat),
                            zIndex:120,
                            rank:1, // 优先避让级
                            icon:scnicon5,
                            text:text,
                        })
                    }

                    scnLabelsLayer.add(labelmarker)

                    // 添加路线
                    var polyline = new AMap.Polyline({
                        path:[
                            new AMap.LngLat(sLng,sLat),
                            new AMap.LngLat(scnLng,scnLat)
                        ],
                        zIndex:19, 
                        strokeWeight: 2, //线条宽度
                        strokeColor: "green", //线条颜色
                        strokeOpacity: 0.8,
                        strokeStyle:"dashed"
                    })
                    scnPathLayer.add(polyline)
                }
            }
        }

    }
    map.add(scnLabelsLayer)
}


function min_to_h(min){
    h = Math.floor(min/60)
    newmin = Math.floor(min%60)
    if(h != 0){
        str = h + 'h' + newmin + "min"
    }
    else{
        str = Math.floor(min) + "min"
    }
    return str
}

// 显示所有景点
function showAll(){
    var set = get_od()
    value_5A = set[3]
    value_4A = set[4]
    value_3A = set[5]
    if(document.getElementById("all_scenery").innerHTML == "显示所有景点"){
        document.getElementById("all_scenery").innerHTML = "隐藏所有景点"
        // 添加景点数据
        for(scn_i = 0;scn_i <station_data.length;scn_i++){
            this_station = station_data[scn_i]
            sLng = this_station.Lng
            sLat = this_station.Lat
            if(this_station.near_scenery.length != 0){
                for(scn_j = 0;scn_j<this_station.near_scenery.length;scn_j++){
                    level = this_station.near_scenery[scn_j].slice(0,1)
                    // 判断是否应该添加
                    badd = false
                    if(level == 3 & value_3A != '0'){
                            badd = true
                        }
                    if(level == 4 & value_4A != '0'){
                            badd = true
                        }
                    if(level == 5 & value_5A != '0'){
                            badd = true
                        }

                    if(badd){
                        scnLng = Number(this_station.scenery_Lng[scn_j])
                        scnLat = Number(this_station.scenery_Lat[scn_j])
                        level = this_station.near_scenery[scn_j].slice(0,1)
                        scnName = this_station.scenery_name[scn_j]

                        // 添加景点
                        const text={
                            content: level + "A:" +  scnName,
                            direction: "right",
                            offset:[0,0], // 偏移方向

                            style:{
                                fontSize: 12, //字体大小    
                                fillColor: "#111111", //字体颜色
                                strokeColor: "#fff", //描边颜色
                                strokeWidth: 2, //描边宽度
                                },
                                zIndex:120,
                        }

                        if(level == 3)
                        {
                            labelmarker = new AMap.LabelMarker({
                                name:'标注',
                                position: new AMap.LngLat(scnLng,scnLat),
                                zIndex:120,
                                rank:1, // 优先避让级
                                icon:scnicon3,
                                text:text,
                            })
                        }
                        else if(level == 4) {
                            labelmarker = new AMap.LabelMarker({
                                name:'标注',
                                position: new AMap.LngLat(scnLng,scnLat),
                                zIndex:120,
                                rank:1, // 优先避让级
                                icon:scnicon4,
                                text:text,
                            })
                        }
                        else {
                            labelmarker = new AMap.LabelMarker({
                                name:'标注',
                                position: new AMap.LngLat(scnLng,scnLat),
                                zIndex:120,
                                rank:1, // 优先避让级
                                icon:scnicon5,
                                text:text,
                            })
                        }
                        allScnLabelsLayer.add(labelmarker)
                    }
                }
            }

        }




    }
    else{
        // 删除并重新添加图层
        document.getElementById("all_scenery").innerHTML = "显示所有景点"
        map.remove(allScnLabelsLayer)
        allScnLabelsLayer = new AMap.LabelsLayer({
        zIndex:15,
         })
        map.add(allScnLabelsLayer)
    }
}