const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 6000;

const server = http.createServer(function(req, res) {
    res.setHeader("Content-Type", "text/plain");

    if (req.method == "GET" && req.url == "/") {
        res.write("Welcome to my REST API Server");
        res.end();
    }

    if (req.method == "GET" && req.url == "/list") {
        fs.readFile("students.json", function(err, data) {
            if (err) {
                res.end("Error reading file");
                return;
            }
            res.write(data);
            res.end();
        });
    }

    if (req.method == "POST") {
        const newStu = url.parse(req.url, true).query;
        const stu = JSON.parse(fs.readFileSync("students.json", "utf8"));

        stu.push(newStu);
        mywrite(stu);

        res.write("Student Record Inserted");
        res.end();
    }

    if (req.method == "PUT") {
        const upstu = url.parse(req.url, true).query;
        const stu = JSON.parse(fs.readFileSync("students.json", "utf8"));
        let found = false;

        for (let s in stu) {
            if (stu[s].roll == upstu.roll) {
                stu[s].name = upstu.name;
                stu[s].branch = upstu.branch;
                stu[s].cgpa = upstu.cgpa;
                found = true;
                break;
            }
        }

        if (found) {
            mywrite(stu);
            res.write("Student Data Updated");
        } else {
            res.write("Student Record Not Found");
        }
        res.end();
    }

    if (req.method == "DELETE") {
        const delstu = url.parse(req.url, true).query;
        const stu = JSON.parse(fs.readFileSync("students.json", "utf8"));
        let found = false;

        for (let s in stu) {
            if (stu[s].roll == delstu.roll) {
                stu.splice(s, 1);
                found = true;
                break;
            }
        }

        if (found) {
            mywrite(stu);
            res.write("Student Record Deleted");
        } else {
            res.write("Student Record Not Found");
        }
        res.end();
    }
});

function mywrite(data) {
    fs.writeFile("students.json", JSON.stringify(data, null, 2),
        function(err) {
            if (err) console.log("Error:", err);
        }
    );
}

server.listen(port, function() {
    console.log("Server started");
    console.log("Server is listening on " + port);
});