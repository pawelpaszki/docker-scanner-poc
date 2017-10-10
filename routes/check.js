var Docker = require('dockerode');
var fs = require('fs');

var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});

module.exports = function(app) {

    //app.get('/checkdockerimage',  function (req, res) {
        var name = 'scoady2/lifecycle-management-for-docker';
        var tag = 'latest';

        var repoTag = name + ':' + tag;
        // pull image specified by hardcoded name + tag
        function pullImage(repoTag) {
            return new Promise(function(resolve, reject) {
                docker.pull(repoTag, function(err, stream) {
                    if (err) {
                        reject(err);
                    }
                    docker.modem.followProgress(stream, onFinished, onProgress)
                    function onFinished(err, output) {
                        if (err) {
                            reject(new Error(err));
                        }
                        resolve(output);
                        // promises are supported
                        docker.createContainer({
                            Image: repoTag,
                            AttachStdin: false,
                            AttachStdout: true,
                            AttachStderr: true,
                            Tty: true,
                            OpenStdin: false,
                            StdinOnce: false
                        }).then(function(container) {
                            container.start();
                            // export container to .tar
                            container.export(function(err, stream){
                                if(err) {
                                    return console.log("Error when exporting");
                                }
                                console.log("Start writing to tar");
                                ws = fs.createWriteStream("test.tar");
                                stream.pipe(ws);
                                ws.on('finish', function(){
                                    var exec = require('child_process').exec;
                                    var child;
                                    // create new directory to store source code
                                    child = exec("mkdir test_dir", function (error, stdout, stderr) {
                                        if (error) {
                                            console.log('exec error: ' + error);
                                        }
                                        // untar exported container into newly created directory
                                        child = exec("tar -x -f test.tar --directory ./test_dir", function (error, stdout, stderr) {
                                            console.log("Start extracting from tar");
                                            if (error) {
                                                return console.log('exec error: ' + error);
                                            }
                                            // run tests and output to result.txt
                                            child = exec("cd test_dir/code/ && npm test > ../../result.txt", function (error, stdout, stderr) {
                                                console.log("Start testing extracted application");
                                                if (error) {
                                                    child = exec("find . -type f -name \"result.txt\"\n", function (error,stdout,stderr) {
                                                       if(error) {
                                                           return console.log("Something went wrong!");
                                                       }
                                                       if(stdout != null) {
                                                           // output to the console test results
                                                           child = exec ("cat result.txt", function(error, stdout, stderr) {
                                                           if(error) {
                                                               return console.log("something went wrong!");
                                                           }
                                                           console.log(stdout);
                                                           console.log("========================");
                                                           console.log("Checking for vulnerable components");
                                                           // run nsp check on source code and output to txt file
                                                           child = exec ("cd test_dir/code/ && nsp check 2> vuln_check.txt", function(error, stdout, stderr) {
                                                               if(error) {
                                                                   if (stdout != null) {
                                                                       // print to the console nsp check results
                                                                       child = exec("cat ./test_dir/code/vuln_check.txt", function (error, stdout, stderr) {
                                                                           if (error) {
                                                                               return console.log("something went wrong!");
                                                                           }
                                                                           console.log(stdout);
                                                                           console.log("attempting to update components");
                                                                           // update component list in package.json
                                                                           child = exec("cd test_dir/code && ncu -a --packageFile package.json", function (error, stdout, stderr) {
                                                                               if (error) {
                                                                                   return console.log(stderr);
                                                                               }
                                                                               console.log("components updated. Attempting to install updated components");
                                                                               // install updated compontens
                                                                               child = exec("cd test_dir/code && npm install", function (error, stdout, stderr) {
                                                                                   if (error) {
                                                                                       return console.log(stderr);
                                                                                   }
                                                                                   //console.log(stdout);
                                                                                   console.log("components installed. Running vulnerability check again");
                                                                                   // run nsp check on updated components
                                                                                   child = exec ("cd test_dir/code/ && nsp check 2> new_vuln_check.txt", function(error, stdout, stderr) {
                                                                                       if (error) {
                                                                                           // display content of nsp check in the console
                                                                                           child = exec("cat ./test_dir/code/new_vuln_check.txt", function (error, stdout, stderr) {
                                                                                               if (error) {
                                                                                                   return console.log("something went wrong!");
                                                                                               }
                                                                                               console.log(stdout);
                                                                                               console.log("\nRunning tests again:");
                                                                                               // run tests again and display results to the console
                                                                                               child = exec("cd test_dir/code/ && npm test > ../../newresult.txt && cat newresult.txt", function (error, stdout, stderr) {
                                                                                                   if(error) {
                                                                                                       return console.log("something went wrong!");
                                                                                                   }
                                                                                                   console.log(stdout);
                                                                                               });
                                                                                           });
                                                                                       }
                                                                                   });
                                                                               });

                                                                           });
                                                                       });
                                                                   }

                                                               }
                                                               });
                                                           });
                                                       }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                    console.log("finished");
                                });
                            });
                        });
                    }
                    function onProgress(event) {
                        console.log(event);
                    }
                })
            })
        }

        pullImage(repoTag);

    //});
}