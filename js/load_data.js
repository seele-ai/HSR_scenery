var station_data = []

// 加载数据
//$.ajax({
//    url:"data/final_station.csv",
//    dataType:"text",
//}).done(successFunction)

// 加载json
$.getJSON("data/data.json",function(data){
    station_data = data
    // 将读取的数据导入起终点中
    load_page();

    // 初始化地图
    load_map();
})


// 导入数据，读取csv数据(弃用)
function successFunction(data){
    allRows = data.split(/\r?\n|\r/);
    for(i=1;i<allRows.length-1;i++){
        theraw = allRows[i]
        // 初始化当前站点
        current_station = {
            id:"",
            name:"",
            Lng:"",
            Lat:"",
            near_station:[],
            near_time:[],
            near_scenery:[],
            scenery_time:[],
            scenery_name:[],
            scenery_Lat:[],
            scenery_Lng:[]
        }
        // 当前是数组的那一个
        current_index = 0;
        // 记录是否出现双引号,若已出现双引号，则追踪到下一个双引号
        cite = false;
        current_data = ""
        for(j=1;j<theraw.length;j++){
            // 逐字符添加数据，当未出现双引号时，将字符串加入current_data直到出现逗号
            // 当出现逗号时，根据index将数据推入指定位置，并初始化current_data，index也+1
            // 当出现双引号时，设置cite为！cite
            // 当在双引号情况下,重新设置currentdata的格式为[],获取数据直到出现双引号
            cur_char = theraw[j]
            // 忽略空格
            if(cur_char == " "){

            }
            else if(cur_char == "'"){
                //将单引号换为双引号以保持一致
                cur_char = "\""
            }
            else if(cur_char != "," && cur_char!="\"" && cite != true){
                current_data += cur_char;
            }
            else if(cur_char == "," && cite != true){
                current_station = push_data(current_station,current_index,current_data);
                current_data = ""
                current_index+=1
            }
            // 在非双引号情况下出现双引号，将当前数据更改为数组，设置双引号为true
            else if(cur_char == "\"" && cite != true){
                current_data = [""]
                cite = true
            }
            // 在双引号情况下出现中括号，进行忽略
            else if(cur_char == "[" || cur_char == "]"){

            }
            // 在双引号情况下出现普通字符，当前数据最后一位添加当前字符
            else if(cur_char != "," && cur_char != "\""&& cite == true){
                current_data[current_data.length-1]+=cur_char
            }
            // 在双引号情况下出现逗号，给当前数据添加空字符串
            else if (cur_char == "," && cite == true){
                current_data.push("")
            }
            // 在双引号情况下出现双引号，双引号结束
            else if(cur_char == "\"" && cite == true){
                cite = false
            }
        }
        // 导入最后一列数据
        push_data(current_station,current_index,current_data)
        //station_data[current_data.id] = current_data
        station_data.push(current_station)
    }
    // 将读取的数据导入起终点中
    load_page();

    // 初始化地图
    load_map();
}

// 根据index将数据推入到station中
function push_data(station,index,data){
    switch(index){
        case 0:
            break;
        case 1:
            station.id = data;
            break;
        case 2:
            station.name = data + "站";
            break;
        case 3:
            station.Lng = data;
            break;
        case 4:
            station.Lat = data;
            break;
        case 5:
            //只有一个站点的情况：
            if(typeof(data) == String){
                data = data.slice(1,-1)
                station.near_station = [data]
            }
            else{
                station.near_station = data;
            }
            break;
        case 6:
            station.near_time = data;
            break;
        case 7:
            //只有一个景点
            if(typeof (data) == String){
                station.near_scenery = [data];
            }else
            {
            station.near_scenery = data;
        }
            break;
        case 8:
            station.scenery_time = data;
            break;
        case 9:
            station.scenery_name = data;
            break;
        case 10:
            station.scenery_Lat = data;
            break;
        case 11:
            station.scenery_Lng = data;
            break;
        default:
            console.log(station)
            console.log(index)
            console.log(data)
    }
    return station;
}

//加载页面，将数据引入起终点数据中
function load_page(){
    source = document.getElementById("source_station_select")
    target = document.getElementById("target_station_select")
    for(i=0;i<=station_data.length-1;i++){
        new_option1 = document.createElement("option")
        new_option1.setAttribute("value",`${station_data[i].id}`)
        new_option1.innerHTML = station_data[i].name
        source.appendChild(new_option1)
        new_option2 = document.createElement("option")
        new_option2.setAttribute("value",`${station_data[i].id}`)
        new_option2.innerHTML = station_data[i].name
        target.appendChild(new_option2)
    }
    // 使用JQuery优化select,nb
    selector_source = $('#source_station_select').select2({
        placeholder:'请输入起点站',
        width:"80%"
    });
    selector_target = $('#target_station_select').select2({
        placeholder:'请输入终点站',
        width:"80%"
    });
}

// 根据站点id获取其在数组内的index
function id_to_index(id_input){
    for(i=id_input-2;i<id_input+1;i++){
        if (station_data[i]){ // 当前的i存在
            if(station_data[i].id == id_input){ //当前i的id等于输入的id
                return i
            }
        }
    }
    console.error(id_input)
    return -1
}