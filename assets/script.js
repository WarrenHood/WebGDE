window.onload = function(){
  try{
  preview_pane = document.getElementById("preview");
  html_tree_pane = document.getElementById("html-tree");
  html_tree_head = document.getElementById("html-tree-head");
  attribute_editor = document.getElementById("attribute-editor");
  attribute_head = document.getElementById("attribute-head");
  preview_pane.style.height = window.innerHeight*0.7 + "px";
  preview_pane.style.width = window.innerWidth*0.7 - 1 + "px";
  html_tree_pane.style.width = window.innerWidth*0.3 - 4 + "px";
  html_tree_pane.style.height = window.innerHeight*0.45 + "px";
  html_tree_pane.style.left = window.innerWidth*0.7 + "px";
  html_tree_pane.style.top = window.innerHeight*0.05 - 2 + "px";
  html_tree_head.style.top = "0px";
  html_tree_head.style.left = window.innerWidth*0.7 + "px";
  html_tree_head.style.width = window.innerWidth * 0.3 - 4 + "px";
  html_tree_head.style.height = window.innerHeight*0.05 - 2 + "px";
  attribute_editor.style.left = window.innerWidth*0.7 + "px";
  attribute_editor.style.height = window.innerHeight*0.45 - 2 + "px";
  attribute_editor.style.width = window.innerWidth*0.3 - 4 + "px";
  attribute_editor.style.top = window.innerHeight*0.55 + "px";
  attribute_head.style.height = window.innerHeight*0.05 + "px";
  attribute_head.style.width = window.innerWidth*0.3 - 4 + "px";
  attribute_head.style.top = window.innerHeight*0.5 + "px";
  attribute_head.style.left = window.innerWidth*0.7 + "px";
  }
  catch(e){
    alert(e);
  }
}
