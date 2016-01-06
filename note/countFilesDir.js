var fs = require('fs');

function getFiles (dir, files_, files_count){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  console.log('files', files);
  for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_, files_count);
    } else {
      files_.push(name);
    }
  }
//  return {
//    files_count: files_.length,
//    files: files_
//  };
}

getFiles('src');