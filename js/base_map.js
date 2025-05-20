var map;
var pathLayer;
var scnPathLayer;
var scnLabelsLayer
var allscnpolyline
var allScnLabelsLayer


// 加载器
AMapLoader.load({
    key:'bb1ea64094a8edd0fc2034f96d19063c',
    version:'2.0',
    plugins:["AMap.Scale"]
}).then((AMap) => {
    // 地图初始化
    map = new AMap.Map('Left',{
    viewMode:'2D',
    zoom: 4,
    center:[105,30],
    features:['bg','road'],
    showLabel:false
    })

    // 引入比例尺
    AMap.plugin("Amap.Scale",function(){
        map.addControl(new AMap.Scale({
            visible:true,
        }))
    })


    // 初始化高铁站标注图层
    const stslabelsLayer = new AMap.LabelsLayer({
        zooms:[1,20],  // 设置显示范围
        zIndex:16,  // 绘制顺序
        collision: true, // 层内标注避让
        allowCollision: false,// 不同层标注避让
    })

    // 初始化高铁站图标对象
    const stsicon={
        type:"image",
        image:"img/station.png",
        size:[12,12], // 图片尺寸
        anchor: 'center'
    }

    // 初始化线路列表
    pathList = [];
    // 标记高铁站,显示线路
    for(map_i=0;map_i<station_data.length;map_i++){
        station = station_data[map_i]
        Lng = Number(station.Lng)
        Lat = Number(station.Lat)
        // 设置文字对象
        const text={
            content: station.name,
            direction: "right",
            offset:[0,0], // 偏移方向
            style:{
                fontSize: 14, //字体大小    
                fillColor: "#0a9ee7", //字体颜色
                strokeColor: "#fff", //描边颜色
                strokeWidth: 2, //描边宽度
            }
        }

        labelmarker = new AMap.LabelMarker({
            name:'标注',
            position: new AMap.LngLat(Lng,Lat),
            zIndex:125,
            rank:1, // 优先避让级
            icon:stsicon,
            text:text,
        })
        stslabelsLayer.add(labelmarker)

        // 将线路加入地图
        for(map_j=0;map_j<station.near_station.length;map_j++){
            near = station.near_station[map_j]
            if(station.id < near){
                var path = [
                    new AMap.LngLat(Lng,Lat),
                    new AMap.LngLat(station_data[id_to_index(near)].Lng,
                                    station_data[id_to_index(near)].Lat)
                ]
                var polyline = new AMap.Polyline({
                    path:path,
                    zIndex:10, 
                    strokeWeight: 2, //线条宽度
                    strokeColor: "black", //线条颜色
                    strokeStyle:"dashed", // 线条样式
                    strokeDasharray:[10,2,10],

                })
                pathList.push(polyline)
            }
        }
    }

    // 添加线路图层
    var roadLayer = new AMap.VectorLayer({
        zIndex:10,
    });
    map.add(roadLayer);
    roadLayer.add(pathList)

    // 添加路径图层
    pathLayer = new AMap.VectorLayer({
        zIndex:20,
    })
    map.add(pathLayer)

    // 添加景点图层
    scnLabelsLayer = new AMap.LabelsLayer({
        zIndex:15,
    })
    map.add(scnLabelsLayer)
    scnPathLayer = new AMap.VectorLayer({
        zIndex:16
    })

    // 所有景点
    allScnLabelsLayer = new AMap.LabelsLayer({
        zIndex:15,
    })
    map.add(allScnLabelsLayer)
    
    // 添加站点图层
    map.add(stslabelsLayer)
})
.catch((e) => {
    console.error(e)
})

function load_map(){

}