elements = [
  {
    display_name : "HTML document",
    tag_start : "html",
    tag_end : "/html",
    description : "The actual html document element"
  },
  {
    display_name : "Head",
    tag_start : "head",
    tag_end : "/head",
    description : "The html head tag"
  },
  {
    display_name : "Title",
    tag_start : "html",
    tag_end : "/html",
    description : "Sets the webpage title"
  }
]
function loadElementChooser(){
  var htm = "<table style='border-collapse:collapse;position:absolute;width:"+(window.innerWidth*0.25-2)+"px;border:1px solid grey;'>";
  htm += "<tr style='color:red;'><td class='selected'>Element</td><td overflow:scroll;>Description</td></tr>";
  for(var i=0; i<elements.length; i++){
    var func = "document.getElementsByClassName(\"selected\")[0].className = \"\";\
    document.getElementById(\""+i+"\").className = \"selected\";";
    htm += "<tr onclick='javascript: "+func+"'><td id='"+i+"' >"+elements[i].display_name;
    htm += "</td><td>"+elements[i].description;
    htm += "</td></tr>";
  }
  htm += "</table>";
  element_pane.innerHTML = htm;
}
window.onload = function(){
  try{
  preview_pane = document.getElementById("preview");
  html_tree_pane = document.getElementById("html-tree");
  html_tree_head = document.getElementById("html-tree-head");
  attribute_editor = document.getElementById("attribute-editor");
  attribute_head = document.getElementById("attribute-head");
  element_pane = document.getElementById("element-chooser");
  element_head = document.getElementById("element-head");
  element_head.style.width = window.innerWidth*0.25 - 2 + "px";
  element_head.style.height = window.innerHeight*0.05 - 2 + "px";
  element_head.style.left = window.innerWidth*0.45 + 1 + "px";
  element_pane.style.width = window.innerWidth*0.25 - 2 + "px";
  element_pane.style.height = window.innerHeight*0.95 - 2 + "px";
  element_pane.style.top = window.innerHeight*0.05 + 1 + "px";
  element_pane.style.left = window.innerWidth*0.45 + 1 + "px";
  preview_pane.style.height = window.innerHeight*0.5 - 2 + "px";
  preview_pane.style.width = window.innerWidth*0.45 - 2 + "px";
  html_tree_pane.style.width = window.innerWidth*0.3 - 2 + "px";
  html_tree_pane.style.height = window.innerHeight*0.45 -2 + "px";
  html_tree_pane.style.left = window.innerWidth*0.7 + 1 + "px";
  html_tree_pane.style.top = window.innerHeight*0.05 + 1 + "px";
  html_tree_head.style.top = "1px";
  html_tree_head.style.left = window.innerWidth*0.7 + 1 + "px";
  html_tree_head.style.width = window.innerWidth * 0.3 - 2 + "px";
  html_tree_head.style.height = window.innerHeight*0.05 - 2 + "px";
  attribute_editor.style.left = window.innerWidth*0.7 + 1 + "px";
  attribute_editor.style.height = window.innerHeight*0.45 - 2 + "px";
  attribute_editor.style.width = window.innerWidth*0.3 - 2 + "px";
  attribute_editor.style.top = window.innerHeight*0.55 + 1 + "px";
  attribute_head.style.height = window.innerHeight*0.05 -2 + "px";
  attribute_head.style.width = window.innerWidth*0.3 - 2 + "px";
  attribute_head.style.top = window.innerHeight*0.5 + 1 + "px";
  attribute_head.style.left = window.innerWidth*0.7 + 1 + "px";
  loadElementChooser();
  }
  catch(e){
    alert(e);
  }
}
