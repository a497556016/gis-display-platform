export default [
    {
        title: "基础底图",
        children: [
            {
                title: "在线地图",
                icon: "map",
                children: [
                    {title: "OpenStreetMap(OSM)", path: "/map/osm.js", image: require("../assets/images/map/osm.jpg")},
                    {title: "天地矢量图", path: "/map/tianditu_s.js", image: require("../assets/images/map/tianditu_s.jpg")},
                    {title: "天地影像图", path: "/map/tianditu_c.js", image: require("../assets/images/map/tianditu_c.jpg")},
                    {title: "谷歌", path: "/map/google.js", image: require("../assets/images/map/google.jpg")},
                    {title: "高德影像", path: "/map/gaode_c.js", image: require("../assets/images/map/gaode_c.jpg")},
                    {title: "高德街道", path: "/map/gaode_s.js", image: require("../assets/images/map/gaode_s.jpg")},
                    {title: "百度", path: "/map/baidu.js", image: require("../assets/images/map.jpg")},
                    {title: "ArcGIS", path: "/map/ArcGIS.js", image: require("../assets/images/map/arcGIS.jpg")}
                ]
            }
        ]
    },
    {
        title: "智慧交通",
        children: [
            {title: "地下空间监测", path: "http://47.106.151.158:8086/issue-external-pack", image: require("../assets/images/map.jpg")},
        ]
    },
    {title: "百度", path: "http://www.baidu.com", type: '2'},
    {title: "测试", path: "/Test"}
]