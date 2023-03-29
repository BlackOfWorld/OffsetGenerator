import LightingFs from "@isomorphic-git/lightning-fs";
import git from "isomorphic-git";
import jsYaml from "js-yaml";
import http from "./http/index";
import * as shared from "./shared";
const fs = new LightingFs("fs");
const fsp = fs.promises;

self.onmessage = async (event) => {
  if (event.data.type === "init") {
    let path = "/data";
    try {
      await fsp.mkdir(path);
    } catch (e) {}
    await git.clone({
      fs: fs,
      http: http,
      dir: "/data",
      corsProxy: "https://cors.isomorphic-git.org",
      url: "https://github.com/VergiliusProject/kernels-data",
      ref: "master",
      singleBranch: true,
      depth: 1,
      onProgress: (progress) => {
        progress;
        self.postMessage({ type: "gitProgress", data: progress });
      },
      onMessage: (message) => {
        self.postMessage({ type: "gitMessage", data: message });
      },
    });
    if(!(await fsp.stat('/data/yml')).isDirectory()) {
      self.postMessage({ type: "gitReceiveUpdate", file: '...Fatal error (yml not dir)!' });
       return;
    }


    let offsets: shared.offsetData[] = [];
    for await (const file of await fsp.readdir("/data/yml")) {
      var data = await fsp.readFile(`/data/yml/${file}`, "utf8");
      self.postMessage({ type: "gitReceiveUpdate", file: file });
      const objData: shared.winOS = jsYaml.load(data);
      if (objData.types == undefined) return;
      objData.types.forEach((type: shared.winType) => {
        if(type.kind != "STRUCT" && type.kind != "UNION") return;
        if (type.name == null || type.data == undefined) return;
        var offsetData : shared.offsetData = {
          name: type.name,
          variables: type.data
        };
        offsets = offsets.concat(offsetData)
      });
      const table: shared.offsetTable = {
        family: objData.family,
        arch: objData.arch,
        data: offsets,
        buildNumber: objData.buildnumber,
      };
      shared.tables.push(table);
    }
    console.log(shared.tables);
    self.postMessage({ type: "gitDownloadDone", tables: shared.tables  });
    
  }
  console.log(`Received message ${event.data}`);
};
