global_elts = [];
function stringrep(char,reps){
  var s = "";
  for(var i = 0;i < reps;i++)s+=char;
  return s;
};
function elt(start_tag,end_tag,display_name){
  this.global_id = global_elts.length;
  this.display_name = display_name || start_tag;
  this.start_tag = start_tag;
  this.end_tag = end_tag;
  this.inner = "";
  this.children = [];
  this.parent = null;
  this.atts = [];
  this.makeChild = function(child_start,child_end,child_display){
    var child = new elt(child_start,child_end,child_display);
    return this.addChild(child);
  }
  this.addChild = function(child){
    this.children.push(child);
    child.parent = this;
    return child;
  };
  this.removeChild = function(child){
    child.remove();
  };
  this.remove = function(){
    if(this.parent)for(var j=0; j<this.parent.children.length;j++){
      if(this.parent.children[j] == this){
        this.parent.children.splice(j,1);
        break;
      };
    };
  };
  this.attFind = function(att_name){
    for(var i=0; i<this.atts.length;i++){
      if(this.atts[i].name == att_name)return this.atts[i];
    };
  };
  this.attEdit = function(att_name,att_val){
    var att = this.attFind(att_name);
    if(!att){
      att = {name:att_name,val:att_val};
      this.atts.push(att);
    };
    att.val = att_val;
  };
  global_elts.push(this);
  return this;
}
function mapOut(root,level){
  level = level || 0;
  var str = stringrep("-",level) + root.display_name + "<br>";
  for(var i=0; i<root.children.length;i++){
    str += mapOut(root.children[i],level+1);
  };
  return str;
}

doc = new elt("html","/html","document");
doc_head = doc.makeChild("head","/head");
doc_body = doc.makeChild("body","/body");
head_style = doc_head.makeChild("style","/style");
body_para1 = doc_body.makeChild("p","/p");
body_div1 = doc_body.makeChild("div","/div");
div1_span1 = body_div1.makeChild("span","/span");
div1_div2 = body_div1.makeChild("div","/div");
div2_p1 = div1_div2.makeChild("p","/p");
div2_h1 = div1_div2.makeChild("h1","/h1");

elements = [
  {
    display_name : "[FORMAT] Bold",
    tag_start : "b",
    tag_end : "/b",
    description : "Formats children text bold"
  },
  {
    display_name : "[FORMAT] Italics",
    tag_start : "i",
    tag_end : "/i",
    description : "Formats children text in italics"
  },
  {
    display_name : "[FORMAT] Underline",
    tag_start : "u",
    tag_end : "/u",
    description : "Underlines children text"
  },
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
  },
  {
    display_name : "Body",
    tag_start : "body",
    tag_end : "/body",
    description : "Element containing the page content"
  },
  {
    display_name : "Paragraph",
    tag_start : "p",
    tag_end : "/p",
    description : "A paragraph element"
  },
  {
    display_name : "Heading 1",
    tag_start : "h1",
    tag_end : "/h1",
    description : "The biggest heading"
  },
  {
    display_name : "Heading 2",
    tag_start : "h2",
    tag_end : "/h2",
    description : "The second biggest heading"
  },
  {
    display_name : "Heading 3",
    tag_start : "h3",
    tag_end : "/h3",
    description : "The third biggest heading"
  },
  {
    display_name : "Heading 4",
    tag_start : "h4",
    tag_end : "/h4",
    description : "The third smallest heading"
  },
  {
    display_name : "Heading 5",
    tag_start : "h5",
    tag_end : "/h5",
    description : "The second smallest heading"
  },
  {
    display_name : "Heading 6",
    tag_start : "h6",
    tag_end : "/h6",
    description : "The smallest heading"
  },
  {
    display_name : "Image",
    tag_start : "img",
    tag_end : "",
    description : "An image element"
  }
]
function loadElementChooser(){
  var htm = "<table style='border-collapse:collapse;width:"+(window.innerWidth*0.25-2)+"px;border:1px solid grey;'>";
  htm += "<tr style='color:red;'><td>Element</td><td overflow:scroll;>Description</td></tr>";
  for(var i=0; i<elements.length; i++){
    var func = "if(document.getElementsByClassName(\"selected\").length)\
    document.getElementsByClassName(\"selected\")[0].className = \"\";\
    document.getElementById(\"row"+i+"\").className = \"selected\";";
    var mouseover = "var current = document.getElementById(\"row"+i+"\");\
    current.style.background = \"black\";\
    current.style.color = \"orange\";\
    ";
    var mouseout = "var current = document.getElementById(\"row"+i+"\");\
    current.style.background = \"\";\
    current.style.color = \"\";\
    \
    ";
    htm += "<tr onmouseover='javascript: "+mouseover+"' \
     onmouseout='javascript: "+mouseout+" '\
    onclick='javascript: "+func+"' id='row"+i+"'><td id='"+i+"' >"+elements[i].display_name;
    htm += "</td><td>"+elements[i].description;
    htm += "</td></tr>";
  }
  htm += "</table>";
  element_pane.innerHTML = htm;
}
window.onload = function(){
  preview_pane = document.getElementById("preview");
  html_tree_pane = document.getElementById("html-tree");
  html_tree_head = document.getElementById("html-tree-head");
  attribute_editor = document.getElementById("attribute-editor");
  attribute_head = document.getElementById("attribute-head");
  element_pane = document.getElementById("element-chooser");
  element_search = document.getElementById("element-search");
  element_head = document.getElementById("element-head");
  element_head.style.width = window.innerWidth*0.25 - 2 + "px";
  element_head.style.height = window.innerHeight*0.05 - 2 + "px";
  element_head.style.left = window.innerWidth*0.45 + 1 + "px";
  element_search.style.height = window.innerHeight*0.04 - 2 + "px";
  element_search.style.width = window.innerWidth*0.25 - 2 + "px";
  element_search.style.top = window.innerHeight*0.05 + 1 + "px";
  element_search.style.left = window.innerWidth*0.45 + 1 + "px";
  element_pane.style.width = window.innerWidth*0.25 - 2 + "px";
  element_pane.style.height = window.innerHeight*0.41 - 2 + "px";
  element_pane.style.top = window.innerHeight*0.09 + 1 + "px";
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
