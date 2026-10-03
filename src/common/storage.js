import file from '@system.file' 

var storageFile = {}
const fileSavedPath = 'internal://files/books/stroage-api/savedFile'

// 兜底解析：读到的文本万一不是合法 JSON（空文件、写入被截断、带 BOM 等），
// JSON.parse 会抛异常。而这个异常发生在 file.readText 的 success 回调内部，
// 会导致 success 和 fail 两个回调都不会被调用 —— 调用方的 Promise 永远不 settle，
// 外部表现就是「书架一片空白，却没有任何报错」。所以这里统一退化成空对象。
function parseSaved(text) {
    try {
        var data = JSON.parse(text);
        if (!data || typeof data !== 'object') {
            return {};
        }
        return data;
    } catch (e) {
        console.log('savedFile 解析失败，按空对象处理: ' + e.message);
        return {};
    }
}

storageFile.get = function(param){
    
    var func = function(data){
        var str = data[param.key];
        if(!str && param.default){
            str = param.default;
        }
        if(!str){
            str = '';
        }
        if(param.success){
            param.success(str);
        }
        if(param.complete){
            param.complete();
        }
    }
    
    file.readText({
      uri: fileSavedPath,
      success: function(data) {
        // console.log('READ SAVED FILE : ' + fileSavedPath + " -> " + data.text)
        func(parseSaved(data.text))
      },
      fail: function(data, code) {
        // console.log(`handling fail, code = ${code}`)
        func({})
      }
    })
}

storageFile.save = function(data,param){
    file.writeText({
      uri: fileSavedPath,
      text: JSON.stringify(data),
      success: function() {
        // console.log('handling success')
        // console.log('SAVE FILE : ' + fileSavedPath + " -> " + JSON.stringify(data))
        if(param.success){
            param.success();
        }
        if(param.complete){
            param.complete();
        }
      },
      fail: function(data, code) {
        console.log(`handling fail, code = ${code}`)
        if(param.fail){
            param.fail(data, code);
        }
        if(param.complete){
            param.complete();
        }
      }
    })
}

storageFile.set = function(param){
    var func = function(data){
        data[param.key] = param.value;
        storageFile.save(data,param);
    }
    
    file.readText({
      uri: fileSavedPath,
      success: function(data) {
        // console.log('READ SAVED FILE : ' + fileSavedPath + " -> " + data.text)
        func(parseSaved(data.text))
      },
      fail: function(data, code) {
        // console.log(`handling fail, code = ${code}`)
        func({})
      }
    })
}

storageFile.clear = function(param){
    var data = {};
    storageFile.save(data,param);
}

storageFile.delete = function(param){
    var func = function(data){
        delete data[param.key];
        storageFile.save(data,param);
    }
    file.readText({
      uri: fileSavedPath,
      success: function(data) {
        // console.log('READ SAVED FILE : ' + fileSavedPath + " -> " + data.text)
        func(parseSaved(data.text))
      },
      fail: function(data, code) {
        // console.log(`handling fail, code = ${code}`)
        func({})
      }
    })
}

// var storage = storageFile
export default storageFile