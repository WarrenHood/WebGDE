global_elts = [];
doc = new elt("html","/html","document");
tree_selected = doc;
function stringrep(char,reps){
  var s = "";
  for(var i = 0;i < reps;i++)s+=char;
  return s;
};
function getElt(global_id){
  return global_elts[global_id];
}
function elt(start_tag,end_tag,display_name){
  this.global_id = global_elts.length;
  this.display_name = display_name || start_tag;
  this.start_tag = start_tag;
  this.end_tag = end_tag;
  this.inner = "";
  this.children = [];
  this.show_children = true;
  this.parent = null;
  this.atts = [];
  this.makeChild = function(child_start,child_end,child_display,index){
    if(index !== 0)index = index || this.children.length;
    var child = new elt(child_start,child_end,child_display);
    return this.addChild(child,index);
  }
  this.addChild = function(child,index){
    if(index !== 0)index = index || this.children.length;
    this.children.splice(index,0,child);
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
function getChildIndex(elt){
    for(var i=0;i<elt.parent.children.length;i++)if(elt.parent.children[i]==elt)return i;
}
function addAbove(){
  if((!element_chosen) || tree_selected == doc)return;
  var toAdd = new elt(element_chosen.start_tag,element_chosen.end_tag,element_chosen.display_name);
  tree_selected.parent.addChild(toAdd,getChildIndex(tree_selected));
  update_pane();
}
function addBelow(){
  if((!element_chosen) || tree_selected == doc)return;
  var toAdd = new elt(element_chosen.start_tag,element_chosen.end_tag,element_chosen.display_name);
  tree_selected.parent.addChild(toAdd,getChildIndex(tree_selected)+1);
  update_pane();
}
function addInside(){
  if((!element_chosen))return;
  var toAdd = new elt(element_chosen.start_tag,element_chosen.end_tag,element_chosen.display_name);
  tree_selected.addChild(toAdd);
  update_pane();
}
function update_pane(){
  html_tree_pane.innerHTML = "<table cellspacing='0' cellpadding='0' id='tree_table'>"+ mapOut(doc)+"</table>";
}
function mapOut(root,level){
  level = level || 0;
  var right_click = "var currentElt = getElt("+root.global_id+");\
    currentElt.show_children = !currentElt.show_children;\
    update_pane();\
    return false;";
  var left_click = "var currentElt = getElt("+root.global_id+");\
  tree_selected = currentElt;\
  update_pane();\
  return false;";
  var init_block_style = (
    (root.show_children)?
    "background:lightgreen;border:0.5px solid darkgreen;":
    "background:red;border:0.5px solid darkred;"
  );
  var str = "<tr>"+stringrep("<td style='"+init_block_style+"'></td>",level) +"<td><div style='\
  "+((root == tree_selected)?
  "color:red;background:white;":
  "color:black;background:grey;")
  +
  "\
    border:0.5px solid black;border-right:none;\
    height:inherit;width:fit-content;z-index:1;  '\
   onclick='"+left_click+"' \
   oncontextmenu=\""+right_click+"\">"+root.display_name+"</div></td>" + stringrep("<td style='border:none;'></td>",getDepth(doc)*2-1-level)+"</tr>";
  if(root.show_children)for(var i=0; i<root.children.length;i++){
    str += mapOut(root.children[i],level+1);
  };
  return str;
}
function getDepth(root,level,most){
  level = level || 1;
  most = most || level;
  for(var i=0;i<root.children.length;i++){
    possibleMost = getDepth(root.children[i],level+1);
    if(possibleMost > most)most = possibleMost;
  }
  return most;
}
doc_head = doc.makeChild("head","/head");
doc_body = doc.makeChild("body","/body");
head_style = doc_head.makeChild("style","/style");
body_para1 = doc_body.makeChild("p","/p","paragraph");
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
    document.getElementById(\"row"+i+"\").className = \"selected\";\
    element_chosen = {start_tag:\""+elements[i].start_tag+"\",\
    end_tag:\""+elements[i].end_tag+"\",\
    display_name:\""+elements[i].display_name+"\"};";
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
loadfunc = function(){
  last_width = window.innerWidth;
  last_height = window.innerHeight;
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
  window.onkeyup = function(e){
    e = e || event;
    if(e.keyCode == 46){
      if(!(tree_selected == doc))tree_selected.remove();update_pane();
    }
  }
  update_pane();
}
window.onload = loadfunc;
setInterval(function(){
  if(window.innerWidth != last_width || window.innerHeight != last_height)
    loadfunc();
},1000);
