function djkistra(){
    var set = get_od()
    station_num = Number(station_data[station_data.length-1].id)
    // 时间列表
    time_list = ['inf']
    for(i=1;i<=station_num;i++){
        time_list.push('inf')
    }
    // 前序站点列表
    pre_list = [-1]
    for(i=1;i<=station_num;i++){
        pre_list.push(-1)
    }
    // 权重列表
    value_list = [0]
    for(i=1;i<=station_num;i++){
        value_list.push(0)
    }
    // 起终点相同，报错
    if(set[0] == set[1]){
        time_list[set[0]] = 0
        err_ori_eq_dir()
    }
    else{
        // 如果存在之前的报错，则将其隐藏
        warning = document.getElementById("warning")
        warning.setAttribute("class","hide")
        max_time = set[2]
        value_5A = set[3]
        value_4A = set[4]
        value_3A = set[5]
        // 记录当前站点
        cur_station = station_data[id_to_index(ori)]

        // 储存已经被遍历过的站点
        done_station = []
        
        // 导入第一个站点的数据
        time_list[ori] = 0
        value_list[ori] += cal_value(cur_station.near_scenery,cur_station.scenery_time) + 1

        // 循环直到终点站所用时间不为inf
        while(time_list[dir] == 'inf'){
            // 当前邻近站点
            cur_near = cur_station.near_station
            // 到邻近站点所需时间
            near_time = cur_station.near_time
            // 邻近站点的数量
            near_num = cur_near.length


            done_station.push(Number(cur_station.id))
            // 当前消耗时间
            cur_all_time = time_list[cur_station.id]
            cur_value = value_list[cur_station.id]
            // 当前权重

            // 遍历邻近站点,更新其时间
            for(i_near=0;i_near<near_num;i_near++){
                the_near = cur_near[i_near]
                // 判断邻近站点是否已经被经过
                find = false
                done_station.forEach(element => {
                    if(element == the_near){
                        find = true
                    }
                });

                // 获取站点当前时间
                station_time = time_list[the_near]
                // 获取站点的权重
                if (station_data[id_to_index(the_near)].near_scenery.length != 0){
                    station_value = cal_value(
                        station_data[id_to_index(the_near)].near_scenery,
                        station_data[id_to_index(the_near)].scenery_time
                    )
                }
                else{
                    station_value = 0
                }
                // 站点已经被经过，跳过
                if(find){
                    true
                }
                // 判断当前到该站点所用带权时间是否更短
                else if(station_time=='inf'){
                    //当前站点无数据，直接更新
                    time_list[the_near] = cur_all_time +Number(near_time[i_near])
                    value_list[the_near] = cur_value + Number(station_value)
                    pre_list[the_near] = cur_station.id
                }
                else{
                    // 当前站点存在数据，比较大小后再更新
                    if(station_time / value_list[the_near] > (cur_all_time + near_time[i_near])/(cur_value + station_value)){
                        time_list[the_near] = cur_all_time + near_time[i_near]
                        value_list[the_near] = cur_value + station_value
                        pre_list[the_near] = cur_station.id
                    }
                }
            }


            // 遍历所有节点，选取未完成节点中相对时间最少的一个作为下一个节点
            min_id = 0
            min_time = 50000
            for(map_i = 1;map_i<=station_num;map_i++){
                if(time_list[map_i] == "inf"){
                    // 跳过时间为无穷的
                    true
                }
                else if(done_station.indexOf(map_i) != -1){
                    // 跳过已经被遍历过的节点
                    true
                }
                else{
                    // 加权后的时间大于当前时间
                    find_time = time_list[map_i] / value_list[map_i]
                    if(find_time > min_time){
                        true
                    }
                    else{
                        min_id = map_i
                        min_time = find_time
                    }
                }
            }
            // 已经找到，跳出循环
            if(min_id == dir){
                true
            }
            // 更新当前站点，准备进入下次循环
            else{
                cur_station = station_data[id_to_index(min_id)]
            }
        }
    }
    

    // 根据前序站点列表，将站点序列、时间序列、景点序列单独储存，便于后续可视化
    path = []
    path.push(station_data[id_to_index(dir)])
    cur_station = dir
    while(cur_station != ori){
        cur_station = pre_list[cur_station]
        path.push(station_data[id_to_index(cur_station)])
    }
    path.reverse()
    show_path(path)
}

function get_od(){
    // 获取起终点
    ori = document.getElementById("source_station_select").value
    dir = document.getElementById("target_station_select").value
    max_time = document.getElementById("set_tour_time").value
    _5A_value = document.getElementById("value_5A").value
    _4A_value = document.getElementById("value_4A").value
    _3A_value = document.getElementById("value_3A").value
    return [ori,dir,max_time,_5A_value,_4A_value,_3A_value]
}

// 计算权重
function cal_value(scenery_list,time_list){
    set = get_od()
    max_time = set[2]
    _5A= set[3]
    _4A = set[4]
    _3A = set[5]
    count5 = 0
    count4 = 0
    count3 = 0
    
    for(i = 0;i<scenery_list.length;i++){
        if(time_list[i] <= max_time * 60 & time_list[i]!=['']){
            switch(scenery_list[i][0]){
                case "3":
                    count3 +=1
                    break
                case "4":
                    count4 +=1
                    break
                case "5":
                    count5 +=1
                    break
                default:
                    console.log("err cal_value")
                    console.log(typeof scenery_list)
                    console.log(scenery_list)
            }
        }
    }

    return _5A * count5 + _4A * count4 + _3A * count3
}



// 起终点相同，单独设个小界面报错
function err_ori_eq_dir(){
    warning = document.getElementById("warning")
    warning.setAttribute("class","show")
    warning.innerHTML = "<strong>警告！</strong>起点站与终点站相同。"

}

// 将所有景点权重设为0
function setAll0(){
    document.getElementById("value_5A").value = 0
    document.getElementById("value_4A").value = 0
    document.getElementById("value_3A").value = 0
}