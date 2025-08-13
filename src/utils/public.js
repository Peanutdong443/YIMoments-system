import { ysnpost,ysnposts,ysnpostTable } from "@/utils/request";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import * as XLXS from "xlsx"; //导出Excel
import FileSaver from "file-saver"; //导出Excel
import {export_json_to_excel} from "./excel/Export2Excel"

// export const pubclass={uid:"",uname:"居正义慈养生公寓"}
//成功提示信息
export function ysnalertS(message) {
    return  ElMessage({
        message,
        type: 'success',
      })
}
//失败提示信息
export function ysnalertE(message) {
    return  ElMessage.error(message)
}

//警告提示信息
export function ysnalertW(message) {
    return  ElMessage({
        message,
        type: 'warning',
      })
}

//获取列表数据
export async function getReportData(Param) {
  // alert(JSON.stringify(Param))
  let res = await ysnpost("Public/PostReportDS", Param);
  if (res.istrue) {
    return res.data;
  } else {
    ysnalertE("喔 获取数据失败了！" + res.msg);
  }
}


//获取列表数据
export async function getTableData(url,Param) {
    // alert(JSON.stringify(Param))
    let res = await ysnpostTable(url, Param);
    if (res.istrue) {
      return res.data;
    } else {
      ysnalertE("喔 获取数据失败了！" + res.msg);
    }
}

//列表数据加载入参对象
export function getParam(obj) {
  let page=obj.page?obj.page:1;let rows=obj.rows?obj.rows:10; let offset=(page-1)*rows;   let isall=obj.isall?obj.isall:"0";
  let search = "";
  for (let key in obj.Selectform) {  
    if (obj.Selectform[key]) {      
      if  (key=="ksrq"||key=="jzrq"){
        search += key + "&" +dayjs(obj.Selectform[key]).format("YYYY-MM-DD")  + "^";
      }else if  (key.indexOf("_KS")>=0||key.indexOf("_JZ")>=0){
        search += key + "&" +dayjs(obj.Selectform[key]).format("YYYY-MM-DD")  + "^";
      }else{
        search += key + "&" + obj.Selectform[key] + "^";
      }
    }
  }
  return {
      sort:obj.sort,//排序字段      
      order:obj.order?obj.order:'DESC',//
      page:page,//第几页
      rows:rows,//每页显示多少条数据
      search:search,//查询条件
      offset:offset,//开始记录数
      limit:rows,//取多少条数据
      isall:isall,
      qwherestr:"",//全局查询条件
  }    
}

//删除操作
export async function InvalidData(Param) {
  let res = await  ysnposts("/Public/Invalid", Param);
  if (res.istrue) {
    return res;
  } else {
    ysnalertE("喔 删除数据失败了！" + res.msg);
    return res;
  }
}
//禁用操作
export async function DisableData(Param) {
  let res = await  ysnposts("/Public/Disable", Param);
  if (res.istrue) {
    return res;
  } else {
    ysnalertE("喔 禁用操作失败了！" + res.msg);
    return res;
  }
}

//真删操作
export async function DeleteData(Param) {
  //{table:"",whereStr:""}
  let res = await  ysnposts("/Public/Shanchu", Param);
  if (res.istrue) {
    return res;
  } else {
    ysnalertE("喔 删除操作失败了！" + res.msg);
    return res;
  }
}

//导出操作
export async function DataToExl(obj) {
   //通过表格id获取导出的表格数据
   const we = XLXS.utils.table_to_book(obj.data, {
    raw: true,
  });
  const weout = XLXS.write(we, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([weout], { type: "application/octet-stream" }),
      obj.name+ dayjs(new Date()).format("YYYY-MM-DD")+".xlsx"
    );
  } catch (error) {
    ysnalertE("喔 导出操作失败了！" + error.message);
  }
  return weout;
}


//表格数据写入excel
export function export2Excel(obj) {
    const tHeader = obj.tHeader;//["报名日期", "姓名", "班级", "学号","性别","邮箱","联系方式","所选导师"]; // 导出的excel表头名信息
    const filterVal = obj.filterVal;//["date","name","class","studentId","sex","email","telephone","teacher" ]; // 导出的excel表头字段名，需要导出表格字段名
    const list = obj.excelData;
    const data = formatJson(filterVal, list);

    export_json_to_excel(tHeader, data, obj.name+ dayjs(new Date()).format("YYYY-MM-DD")); // 导出的表格名称，根据需要自己命名
}
//格式转换，直接复制即可,不需要修改什么
function formatJson(filterVal, jsonData) {
  let i=0;
  return jsonData.map(v => filterVal.map(j => {
    if(j=="index"){i++; return i;}
    else if(j=="State"){if(v[j]=="1"){return "正常"; }else if(v[j]=="0"){return "禁用";}  else {return v[j];}}
    else {return v[j];}
    }));
  }

//得到相应的数据
export async function GetBaseCodeList(str) {
  let res;
  try {
    res = await ysnposts("/Basecodelist/PostDataByCodetype", { Codetype: str });
    if (res.istrue) {
      return res.data;
    } else {
      ysnalertE("喔 获取数据【" + str + "】出错了！" + res.msg);
      return res;
    }
  } catch (error) {
    ysnalertE("喔 获取数据【" + str + "】出错了！" + JSON.stringify(error));
    return res;
  }  
}


//得到相应的数据
export async function GetAllList(TName,  SStr,  WStr) {
  //result.data.ds
  let res = await  ysnposts("/Public/ReturnDsS", {TName,  SStr,  WStr});
  if (res.istrue) {
    return res;
  } else {
    ysnalertE("喔 获取数据出错了！" + res.msg);
    return res;
  }
}
//修改操作
export async function UpdatebyT(Param) {
  // {TableName:"",UpdateStr:"",WhereStr:""}
    //console.log("修改对象");
  //console.log(Param);
  let res = await  ysnpost("/Public/UpdatebyT", Param);
  if (res.istrue) {
    return res;
  } else {
    ysnalertE("喔 获取数据出错了！" + res.msg);
    return res;
  }
}


export async function getZfdjs() {
  let res = await ysnpost("/YlBaseZfdj/PostData", {
    sort:"ZFDJ",//排序字段   
    isall:"1",
});
  if (res.istrue) {
    return res.data.rows;
  } else {   
    ysnalertE("喔 获取照护等级数据失败了！" + res.msg);
    return [];
  }
}

//得到用户信息
export async function getUserLists() {
  let res = await ysnpost("/Baseorguser/PostData", {
    sort:"USERNAME",//排序字段   
    isall:"1",
});
  if (res.istrue) {
    return res.data.rows;
  } else {   
    ysnalertE("喔 获取用户信息数据失败了！" + res.msg);
    return [];
  }
}


//得到两个日期直接相差的天数
export  function getDateDay(date1,date2) { 
  if (date1 && date2) {
    var totalDays, diffDate
    var myDate_1 =  Date.parse(date1)
    var myDate_2 = Date.parse(date2)
    // 将两个日期都转换为毫秒格式，然后做差
    diffDate = myDate_2 - myDate_1; // 取相差毫秒数的绝对值
    totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
    return totalDays // 相差的天数
  }
  return 0;
}


export function cjkEncode(text) {
  if (typeof text !== "string") {
    return text;
  }
  var newText = "";
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code >= 128 || code === 91 || code === 93) {
      newText += "[" + code.toString(16) + "]";
    } else {
      newText += text.charAt(i);
    }
  }
  return newText;
}

