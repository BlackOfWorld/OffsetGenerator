import * as shared from "./shared";
const worker = new Worker(new URL("./worker.ts", import.meta.url));
worker.postMessage({ type: "init" });


worker.onmessage = async (event) => {
  if (event.data.type === "gitReceiveUpdate") {
    let file = event.data.file;
    document.getElementById("status")!.innerHTML = `Reading ${file}`;
  } else if (event.data.type === "gitProgress") {
    type GitProgressEvent = {
      phase: string;
      loaded: number;
      total: number;
    };
    let data: GitProgressEvent = event.data.data;
    document.getElementById(
      "status"
    )!.innerHTML = `Phase: ${data.phase} <br> Loaded: ${data.loaded} <br> Total: ${data.total}`;
  } else if (event.data.type === "gitMessage") {
    console.log(event.data.data);
  } else if (event.data.type === "gitDownloadDone") {
    document.getElementById("status")!.innerHTML = `Downloading done! You may now search for offsets.`;
    shared.tables = event.data.tables;

  }
};

globalThis.searchFunction = function () {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("nameInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("offsetTable");
  var array = shared.tables.filter((table) => {
     table.data.filter((data) => {
      data.name.toUpperCase() == filter;
    }); 
  });
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < array.length; i++) {
    var vv = array[i];
    for(var j = 0; j < vv.data.length; j++) {
      var v = vv.data[j];
      for(var k = 0; k < v.variables.length; k++) {
        var variable = v.variables[k];
        if (variable.name.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
};
