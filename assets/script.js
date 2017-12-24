global_elts = [];
tree_selected = null;
element_chosen = null;
tab_spaces = 2;
doc = new elt("","","document");
function codify(str){
  var container = new elt("","","Container");
  var c = 0;
  var getting_start = false;
  var current_start = "";
  var getting_att = false;
  var current_att_name = "";
  var current_att_value = "";
  var getting_end = false;
  var current_end = "";
  var getting_plain = false;
  var current_plain = "";
  var current_container = container;
  while(c < str.length){
    var ch = str[c];
    if(ch == "<"){
      if(str[c+1] == "/"){
        getting_end = true;
        c++;
        ch = str[c];
        while(ch != ">"){
          current_end += ch;
          c++;
          ch = str[c];
        }
        while(current_end != current_container.start_tag)if(current_container.parent)current_container = current_container.parent;
        current_container.end_tag = current_end;
        current_end = "";
        getting_end = false;

      }
      if(getting_plain){
        var plain = current_container.makeChild("","","Plain Text");
        plain.inner = current_plain;
        current_plain = "";
        getting_plain = false;
      }
      else getting_start = true;
      c++;
      continue;
    }
    if(getting_start){
      if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch))
        current_start += ch;
      else{
        current_container = current_container.makeChild(current_start,"");
        current_start = "";
        getting_start = false;
        if(ch != ">")getting_att = true;
        c++;
        continue;
      }
      if(getting_att){
        if(current_att_name == "" && ch == " "){
          c++;
          continue;
        }
        if(curren_att_name == "" && "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch)){
          getting_att_name = true;
          current_att_name += ch;
          c++;
          continue;
        }
        if(getting_att_name){
          if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch)){
            current_att_name += ch;
            c++;
            continue;
          }
          else{
            if(ch == "="){
              getting_att_name = false;
              getting_att_value = true;
              c++;
              continue;
            }
            else if(ch == " "){
              current_container.attEdit(current_att_name,"");
              current_att_name = "";
              getting_att_name = false;
              c++;
              continue;
            }
            else if(ch == ">"){
              current_container.attEdit(current_att_name,"");
              current_att_name = "";
              getting_att_name = false;
              getting_att = false;
              c++;
              continue;
            }
          }
        }
        if(getting_att_value){
          if(ch == "'" || ch == '"'){
            current_att_value += ch;
            var closer = ch;
            c++;
            ch = str[c];
            while(ch != closer){
              current_att_value += ch;
              c++;
              ch = str[c];
            }
            current_att_value += closer;
            current_container.attEdit(current_att_name,current_att_value);
            getting_att_value = false;
            current_att_value = "";
            current_att_name = "";
            c++;
            continue;
          }
          if(ch == " "){
            current_container.attEdit(current_att_name,current_att_value);
            getting_att_value = false;
            current_att_value = "";
            current_att_name = "";
            c++;
            continue;
          }
          if(ch == ">"){
            current_container.attEdit(current_att_name,current_att_value);
            getting_att_value = false;
            current_att_value = "";
            current_att_name = "";
            getting_att = false;
            c++;
            continue;
          }
          if("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(ch)){
            current_att_value += ch;
            c++;
            continue;
          }
        }
      }
    }
    else if(!getting_end){
    getting_plain = true;
    current_plain += ch;
    }
    c++;
  }
  return container;
};
function htmlify(root,tabdepth){
  tabdepth = tabdepth || 0;
  var str = "";
  if(root.start_tag){
    str += stringrep(stringrep(" ",tabdepth),tab_spaces)+"<"+root.start_tag;
    for(var i=0; i<root.atts.length; i++){
      str += " " + root.atts[i].name;
      if(root.atts[i].val)str += "=" + root.atts[i].val;
    }
    str += ">\n";
  }
  if(root.inner){
    if(root.start_tag && root.end_tag)str += stringrep(stringrep(" ",tabdepth+1),tab_spaces);
    str += root.inner + "\n";
  }
  else
    for(var i=0; i<root.children.length; i++)str += htmlify(root.children[i],tabdepth+1);
  if(root.end_tag)str += stringrep(stringrep(" ",tabdepth),tab_spaces) + "<" + root.end_tag + ">";
  str += "\n";
  return str;
}
function stringrep(char,reps){
  var s = "";
  for(var i = 0;i < reps;i++)s+=char;
  return s;
};
function loadAtts(){
  var table = "<table style='width:inherit;border-collapse:collapse;'>";
  table += "<tr><td>Attribute</td><td>Value</td></tr>";
  if(tree_selected)for(var i=0;i<tree_selected.atts.length;i++){
    var select_att = "last_att = "+i+";";
    var update_att = "\
    var current_att = tree_selected.atts["+i+"];\
    var new_name = document.getElementById(\"att_name_"+i+"\").value;\
    var new_val = document.getElementById(\"att_val_"+i+"\").value;\
    current_att.name = new_name;\
    current_att.val = new_val;";
    table+= "<tr><td><input onfocus='"+select_att+"' onkeyup='"+update_att+"' size=20 id='att_name_"+i+"' value='"+tree_selected.atts[i].name + "' onblur='update_pane();'></td>"
    + "<td><textarea onfocus='"+select_att+"' onkeyup='"+update_att+"' id='att_val_"+i+"' onblur='update_pane();'>"+tree_selected.atts[i].val+"</textarea></td></tr>";
  }
  table += "</table>";
  attribute_editor.innerHTML = table;
}
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
  this.removeAtt = function(i){
    this.atts.splice(i,1);
  }
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
  if((!element_chosen) || tree_selected == doc || (!tree_selected))return;
  var toAdd = new elt(element_chosen.start_tag,element_chosen.end_tag,element_chosen.display_name);
  tree_selected.parent.addChild(toAdd,getChildIndex(tree_selected));
  update_pane();
}
function addBelow(){
  if((!element_chosen) || tree_selected == doc || (!tree_selected))return;
  var toAdd = new elt(element_chosen.start_tag,element_chosen.end_tag,element_chosen.display_name);
  tree_selected.parent.addChild(toAdd,getChildIndex(tree_selected)+1);
  update_pane();
}
function addInside(){
  if((!element_chosen) || (!tree_selected))return;
  tree_selected.makeChild(""+element_chosen.start_tag,""+element_chosen.end_tag,""+element_chosen.display_name);
  update_pane();
}
function update_pane(){
  html_tree_pane.innerHTML = "<table cellspacing='2' cellpadding='0' id='tree_table'>"+ mapOut(doc)+"</table>";
  loadAtts();
  preview_pane.contentWindow.document.open("text/htmlreplace");
  preview_pane.contentWindow.document.write(htmlify(doc));
  preview_pane.contentWindow.document.close();
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
  var childhtml = \"\";\
  if(!tree_selected.inner)for(var i=0; i<tree_selected.children.length; i++)childhtml += htmlify(tree_selected.children[i]);\
  else childhtml = tree_selected.inner;\
  inner_input.value = childhtml;\
  return false;";
  var init_block_style = (
    (root.show_children)?
    "background:lightgreen;border:0.5px solid darkgreen;":
    "background:red;border:0.5px solid darkred;"
  );
  var str = "<tr>"+stringrep("<td style='"+init_block_style+"'></td>",level) +"<td><div style='\
  "+((tree_selected && root == tree_selected)?
  "color:black;background:purple;":
  "color:white;background:purple;")
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
htdoc = doc.makeChild("html","/html","HTML Document")
doc_head = htdoc.makeChild("head","/head");
doc_body = htdoc.makeChild("body","/body");
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
    start_tag : "b",
    end_tag : "/b",
    description : "Formats children text bold"
  },
  {
    display_name : "[FORMAT] Italics",
    start_tag : "i",
    end_tag : "/i",
    description : "Formats children text in italics"
  },
  {
    display_name : "[FORMAT] Underline",
    start_tag : "u",
    end_tag : "/u",
    description : "Underlines children text"
  },
  {
    display_name : "HTML document",
    start_tag : "html",
    end_tag : "/html",
    description : "The actual html document element"
  },
  {
    display_name : "Head",
    start_tag : "head",
    end_tag : "/head",
    description : "The html head tag"
  },
  {
    display_name : "Title",
    start_tag : "title",
    end_tag : "/title",
    description : "Sets the webpage title"
  },
  {
    display_name : "Body",
    start_tag : "body",
    end_tag : "/body",
    description : "Element containing the page content"
  },
  {
    display_name : "Paragraph",
    start_tag : "p",
    end_tag : "/p",
    description : "A paragraph element"
  },
  {
    display_name : "Heading 1",
    start_tag : "h1",
    end_tag : "/h1",
    description : "The biggest heading"
  },
  {
    display_name : "Heading 2",
    start_tag : "h2",
    end_tag : "/h2",
    description : "The second biggest heading"
  },
  {
    display_name : "Heading 3",
    start_tag : "h3",
    end_tag : "/h3",
    description : "The third biggest heading"
  },
  {
    display_name : "Heading 4",
    start_tag : "h4",
    end_tag : "/h4",
    description : "The third smallest heading"
  },
  {
    display_name : "Heading 5",
    start_tag : "h5",
    end_tag : "/h5",
    description : "The second smallest heading"
  },
  {
    display_name : "Heading 6",
    start_tag : "h6",
    end_tag : "/h6",
    description : "The smallest heading"
  },
  {
    display_name : "Image",
    start_tag : "img",
    end_tag : "",
    description : "An image element"
  },
  {
    display_name : "Plain Text",
    start_tag : "",
    end_tag : "",
    description : "Plain text(no tag)"
  }
]
function loadElementChooser(){
  var htm = "<table style='border-collapse:collapse;width:"+(window.innerWidth*0.25-2)+"px;'>";
  htm += "<tr style='color:red;'><td>Element</td><td overflow:scroll;>Description</td></tr>";
  for(var i=0; i<elements.length; i++){
    var func = "if(document.getElementsByClassName(\"selected\").length)\
    document.getElementsByClassName(\"selected\")[0].className = \"\";\
    document.getElementById(\"row"+i+"\").className = \"selected\";\
    element_chosen = {start_tag:\""+elements[i].start_tag+"\", end_tag:\""+elements[i].end_tag+"\",display_name:\""+elements[i].display_name+"\"};";
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
  inner_head = document.getElementById("inner-head");
  inner_pane = document.getElementById("inner-pane");
  inner_input = document.getElementById("inner-input");
  io_menu = document.getElementById("io-menu");
  io_menu.style.width = window.innerWidth*0.2 -2 + "px";
  io_menu.style.height = window.innerHeight*0.5 - 2 + "px";
  io_menu.style.top = window.innerHeight*0.5 + 1 + "px";
  io_menu.style.left = "0px";
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
  inner_head.style.width = window.innerWidth*0.5 - 2 + "px";
  inner_head.style.height = window.innerHeight*0.05 - 2 + "px";
  inner_head.style.left = window.innerWidth*0.2 + 1 + "px";
  inner_head.style.top = window.innerHeight*0.5 + 1 + "px";
  inner_pane.style.width = window.innerWidth*0.5 - 2 + "px";
  inner_pane.style.height = window.innerHeight*0.45 - 2 + "px";
  inner_pane.style.left = window.innerWidth*0.2 + 1 + "px";
  inner_pane.style.top = window.innerHeight*0.55 + 1 + "px";
  loadElementChooser();
  window.onkeyup = function(e){
    e = e || event;
    if(e.keyCode == 46){
      if(!(tree_selected == doc) && tree_selected){tree_selected.remove();tree_selected=null;update_pane();}
    }
  }
  inner_input.onkeyup = function(){
    if(!tree_selected)return;
    tree_selected.inner = inner_input.value;
    update_pane();
  }
  update_pane();
}
window.onload = loadfunc;
setInterval(function(){
  if(window.innerWidth != last_width || window.innerHeight != last_height)
    loadfunc();
},1000);
