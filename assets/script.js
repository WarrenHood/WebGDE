global_elts = [];
tree_selected = null;
element_chosen = null;
tab_spaces = 1;
constant_layout_update = false;
doc = new elt("","","File");
quick_load = true; //Quick load broken
keep_newlines = false;
function loadHTML(str){
  global_elts = [];
  tree_selected = null;
  element_chosen = null;
  tab_spaces = 1;
  constant_layout_update = true;
  doc = new elt("","","File");
  doc.children = codify(str);
  update_pane();
}
/*
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
*/
function make_from_start(str){
  //str is in form '<name space *spaces *(att *(*spaces = *spaces *val))) *spaces >' where *=optional
  var i = 1;
  var start_tag = "";
  while(str[i] != " " && str[i] != ">"){
    start_tag += str[i];
    i++;
  }
  var element = new elt(start_tag,""); //Create and element with start tag name
  var current_att = ""; //Set the current attribute name to nothing
  var getting_att = true; //Start retrieving attribute name
  var getting_val = false; //Do not retrieve attribute value yet
  var current_val = ""; // Set the current attribute value to nothing
  while(i < str.length-1){
    if(current_att == "" && str[i] == " "){ //If the current att is empty and current char is a space
      i++; //Go to the next character
      continue;
    }
    if(getting_att){ //If we are busy retrieving the attribute name
      if(str[i] != " " && str[i] != "="){ // Then while character isn't a space or = sign
        current_att += str[i]; //Add the character to the attribute name
        i++; //Move on to the next character
        continue;
      }
      else{ //We have just finished getting the attribute name
        getting_att = false; //Stop retrieving the attribute name
        while(str[i] == " ")i++; //Strip spaces until we reach an = or another attribute
        if(str[i] == "="){// If the attribute has a value
          getting_val = true; //Start getting value
          i++; //Move to next character
          while(str[i] == " ")i++;  //strip leading spaces
        }
        else{
          //Otherwise add attribute without value now
          element.attEdit(current_att,""); //Added attribute
          current_att = ""; //Reset current attribute new_name
          getting_att = true; // Obviously we must start getting the next attribute name
        }
      }
    }
  else if(getting_val){ // Otherwise we have a name and we are looking for its value
    //We will now get the entire value in a loop
    //We ended on the start of the value, spaces already stripped
    var last_char = ''; //Initialize a last_char
    if(str[i] == "'" || str[i] == '"'){ //If value is in quotes
      var starting_quote = str[i]; //Store the starting quote
      current_val = starting_quote; //Set current value to quote
      i++; //Move to the next character
      while(str[i] != starting_quote || last_char == "\\"){ //While char isn't ending quote
        current_val += str[i]; //Add it to the current Value
        if(last_char == "\\" && str[i] == "\\"){
            last_char = "";
        }
        else last_char = str[i]; //Store the last char
        i++; //Move to the next character
      }
      //Char is now the ending quote, let's add it
      current_val += str[i]; //Added ending quote
      i++; //Move to the next character
    }
    else { //Else if the value is not in quotes
      while(str[i] != " " && i < str.length-1){ //While the value isn't a space and we havent finished the string
          current_val += str[i]; //Add the character to the current value
          i++; //Move to the next character
      }
      //Now the value is either a space or we are done
    }
    //And by now we have got a name,value pair for the attribute.
    element.attEdit(current_att,current_val); //Add our name,value pair to element
    current_att = ""; //Reset current_att for next time
    current_val = ""; //Reset current_val for next time
    getting_val = false; //Stop getting attribute Value
    getting_att = true; //Start getting the next attribute(if there is one)
    }
  }
  if(current_att){
    element.attEdit(current_att,current_val);
  }
  return element;
}
function identify_start_from_end(str){
  var filtered = "";
  for(var i=0; i<str.length; i++){
    if("</ >".includes(str[i]))continue;
    filtered += str[i];
  }
  return filtered;
}
function identify_tag_type(str){
  if(str[0] != "<")return "plain";
  var i = 1;
  while(i < str.length && str[i] == " ")i++;
  if(str[i] == "/")return "end";
  return "start";
}
function has_closing_tag(start_name,array,start){
  start = start || 0;
  for(var i=start; i<array.length; i++){
    if(identify_tag_type(array[i]) != "end")continue;
    if(identify_start_from_end(array[i]) == start_name)return true;
  }
  return false;
}
function filter(str){
  var new_string = "";
  var start = 0;
  while(start < str.length && str[start] == " "){ //While the char is a space
      start++; //Move to next char
  }
  //We have stripped all leading spaces
  var end = str.length - 1;
  while(end >= 0 && str[end] == " "){ //While the char is a space
    end--;
  }
  //We have stripped trailing spaces.
  for(var i=start; i <= end; i++)new_string += str[i];
  return new_string;
}
function split_string(str){
  var list = [];
  var c = 0;
  var current = "";
  var last = "";
  var second_last = "";
  var in_string = false;
  var start_quote = "";
  while(c < str.length){//For each character in the string
    if(!in_string){//If we aren't in a string
        if(str[c] == "\n" && !keep_newlines){
          c++;
          continue;
        }
    }
    if((!in_string) && (str[c] == "<" || str[c] == ">")){ //If we are at the start or end of a tag
      if(str[c] == ">"){ //If we are at the end
        current += str[c]; //Finish the tag off
        current = filter(current);
        if(current)list.push(current); //Push current to the list
        var current = "";
        var last = "";
        var second_last = "";
        var in_string = false;
        var start_quote = "";
        c++; //Move to next character
        continue;
      }
      else { //Else we are at the beginning of a tag
        current = filter(current);
        if(current)list.push(current); //Push current to the list
        var current = "";
        var last = "";
        var second_last = "";
        var in_string = false;
        var start_quote = "";
        current += str[c]; //Add beginning of start tag to current
        c++; //Move to the next character
        continue;
      }
    }
    else{ //Else we are inside some tag or in the innerHTML
      current += str[c]; //Add the char to current;
      if(!in_string){ //If we weren't in a string
        if("'\"".includes(str[c]) && !(str[c] == "'" && last && "abcdefghijklmnopqrstuvwxyz0123456789".includes(last.toLowerCase())) ){ //If we just wrote a quote
            in_string = true; //Then we are now in a string
            start_quote = str[c]; //Store the starting quote
        }
      }
      else{ //Else if we were already in a string
          if(str[c] == start_quote && last != '\\'){ //And we wrote the starting quote
            in_string = false; //Then we aren't in a string anymore
            start_quote = ""; //Reset the starting quote
          }
      }
    }
    var this_second_last = second_last;
    var this_last = last;
    var this_current = str[c];
    second_last = last;
    last = str[c];
    if(this_current == "\\" && this_last == "\\"){
      last = "";
      second_last = "";
    }
    c++; //Go to next character
  }
  current = filter(current);
  if(current)list.push(current);
  return list;
}
function codify(str){
  var list = split_string(str); //Split all of the elements into a list
  var container = new elt("",""); //Create a container
  var current_container = container; //Use container as current one
  for(var i=0; i<list.length; i++){ //For each index in our list
    if(identify_tag_type(list[i]) == "start"){ //If it is a starting tag
      current_container = current_container.addChild(make_from_start(list[i]));
      //We have now got the new element as the current container
      if(!has_closing_tag(current_container.start_tag,list,i+1)){ //If we don't have a closing tag
        current_container = current_container.parent; //Then current_container is set back to its parent
      }
    }
    else if(identify_tag_type(list[i]) == "end"){ //Otherwise if we are closing a tag
      if(identify_start_from_end(list[i]) != current_container.start_tag){ //If start tag doesn't match end tag
        alert("Something is wrong with a closing tag in your code... You are in container: "+current_container.start_tag+" and are trying to close a "+identify_start_from_end(list[i]) + " tag!...(List position: "+i+")");
        current_container.end_tag = "/"+current_container.start_tag;
        current_container = current_container.parent; //Use parent as current container
      }
      else{ //Otherwise start matched end tag
        current_container.end_tag = "/"+identify_start_from_end(list[i]);
        current_container = current_container.parent; //Use parent as current container
      }
    }
    else{ //Otherwise it is plain text
      var plain_holder = current_container.makeChild("","","Text"); //Make a container for it
      plain_holder.inner = list[i]; //Set the innerHTML of the plain to be current
    }
  }
  return container.children;
}
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
function getElt(gl_id){
  for(var i=0; i< global_elts.length; i++)if(global_elts[i].global_id == gl_id)return global_elts[i];
}
function elt(start_tag,end_tag,display_name){
  this.global_id = global_elts.length;
  this.display_name = display_name || find_display_name(start_tag);
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
  this.replace = function(others){
    if(this.parent)for(var j=0; j<this.parent.children.length;j++){
      if(this.parent.children[j] == this){
        console.log("Replacing from here...");
        console.log(this.parent);
        var orig_parent = this.parent;
        orig_parent.children.splice(j,1);
        console.log("Just spliced from position "+j);
        console.log(orig_parent);
        var newkids = [];
        for(var k=0;k<orig_parent.children.length;k++){
          if(k == j){
            for(var l=0; l < others.length; l++){
              newkids.push(others[l]);
              console.log("Added to newkids from new");
              console.log(others[l]);
            }
          }
          else{
            newkids.push(orig_parent.children[k]);
            console.log("Added to newkids from old");
            console.log(orig_parent.children[k]);
          }
        }
        console.log("These are newkids");
        console.log(newkids);
        console.log("Orig_parent with orig remaining kids:");
        console.log(orig_parent);
        orig_parent.children = newkids;
        console.log("With new kids");
        console.log(orig_parent);
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
function update_pane(dont_update_preview_pane){
  html_tree_pane.innerHTML = "<table cellspacing='2' cellpadding='0' id='tree_table'>"+ mapOut(doc)+"</table>";
  loadAtts();
  if(!dont_update_preview_pane){
  preview_pane.contentWindow.document.open("text/htmlreplace");
  preview_pane.contentWindow.document.write(htmlify(doc));
  preview_pane.contentWindow.document.close();
  }
  if(!tree_selected)return;
  var childhtml = "";
  if(!tree_selected.inner)for(var i=0; i<tree_selected.children.length; i++)childhtml += htmlify(tree_selected.children[i]);
  else childhtml = tree_selected.inner;
  cm_editor.setValue(childhtml);
}
function hide_verbose_elements(from){
  from = from || 0;
  for(var i=from; i<global_elts.length; i++){
    if(global_elts[i].children.length){
      for(var j=0; j<global_elts[i].children.length; j++){
        if(!global_elts[i].children[j].start_tag){
          global_elts[i].show_children = false;
          break;
        }
      }
    }
  }
  update_pane(true);
}
function hide_verbose_in(root){
	for(var i=0; i<root.children.length;i++){
		if(!root.children[i].start_tag){
		root.show_children = false;
		}
		hide_verbose_in(root.children[i]);
	}
}
function mapOut(root,level){
  level = level || 0;
  var right_click = "var currentElt = getElt("+root.global_id+");\
    currentElt.show_children = !currentElt.show_children;\
    update_pane(true);\
    return false;";
  var left_click = "var currentElt = getElt("+root.global_id+");\
  tree_selected = currentElt;\
  update_pane(true);\
  var childhtml = \"\";\
  if(!tree_selected.inner)for(var i=0; i<tree_selected.children.length; i++)childhtml += htmlify(tree_selected.children[i]);\
  else childhtml = tree_selected.inner;\
  cm_editor.setValue(childhtml);\
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
    border:0.5px solid blue;border-right:none;\
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
doc_head = htdoc.makeChild("head","/head","Head");
doc_body = htdoc.makeChild("body","/body","Body");
head_style = doc_head.makeChild("style","/style","Style");
function find_display_name(start_tag){
  for(var i=0; i<elements.length; i++){
    if(elements[i].start_tag == start_tag)return elements[i].display_name;
  }
  return start_tag;
}
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
    display_name : "Style",
    start_tag : "style",
    end_tag : "/style",
    description : "An embedded CSS stylesheet"
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
    display_name : "Text",
    start_tag : "",
    end_tag : "",
    description : "Plain text(no tag)"
  },
  {
    display_name : "Comment",
    start_tag : "!--",
    end_tag : "",
    description : "An HTML comment (does nothing at all)"
  },
  {
    display_name : "Link",
    start_tag : "link",
    end_tag : "",
    description : "Usually used to load external resources, especially stylesheets"
  },
  {
    display_name : "Hyperlink",
    start_tag : "a",
    end_tag : "/a",
    description : "Usually opens a specified link when clicked on"
  },
  {
    display_name : "Table",
    start_tag : "table",
    end_tag : "/table",
    description : "Used to make tables"
  },
  {
    display_name : "Table Head",
    start_tag : "thead",
    end_tag : "/thead",
    description : "The head of a table"
  },
  {
    display_name : "Table Body",
    start_tag : "tbody",
    end_tag : "/tbody",
    description : "The body of a table"
  },
  {
    display_name : "Table Row",
    start_tag : "tr",
    end_tag : "/tr",
    description : "A table row"
  },
  {
    display_name : "Table Cell",
    start_tag : "td",
    end_tag : "/td",
    description : "A cell in a table"
  },
  {
    display_name : "Line Break",
    start_tag : "br",
    end_tag : "",
    description : "Begins on a new line"
  },
  {
    display_name : "Unordered List",
    start_tag : "ul",
    end_tag : "/ul",
    description : "A bulleted list"
  },
  {
    display_name : "Ordered List",
    start_tag : "ol",
    end_tag : "/ol",
    description : "A numbered list"
  },
  {
    display_name : "List Item",
    start_tag : "li",
    end_tag : "/li",
    description : "An item in an ordered or unordered list"
  },
  {
    display_name : "Div",
    start_tag : "div",
    end_tag : "/div",
    description : "Used to group elements or put them into divisions"
  },
  {
    display_name : "Span",
    start_tag : "span",
    end_tag : "/span",
    description : "Used to group elements (similar to Divs but doesn't break the flow)"
  },
  {
    display_name : "Document Type",
    start_tag : "!DOCTYPE",
    end_tag : "",
    description : "Used to specify the type of document"
  }
];
elements.sort(function(a,b){
  var nameA=a.display_name.toLowerCase(), nameB=b.display_name.toLowerCase()
	if (nameA < nameB)
 		return -1;
	if (nameA > nameB)
		return 1;
	return 0;
});
function search_elt(){
  var keys = element_search.value.toLowerCase().split(" ");
  for(var i=0; i < elements.length; i++){
    document.getElementById("row"+i).hidden = false;
    for(var j=0; j< keys.length; j++){
      if(!(elements[i].start_tag.toLowerCase().includes(keys[j]) || elements[i].end_tag.toLowerCase().includes(keys[j]) || elements[i].description.toLowerCase().includes(keys[j]) || elements[i].display_name.toLowerCase().includes(keys[j]))){
        document.getElementById("row"+i).hidden = true;
        continue;
      }
      //else alert("It's fine with key: "+keys[i]);
    }
  }
}
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
  cm_editor = CodeMirror.fromTextArea(inner_input, {
    lineNumbers: true,
    theme : "the-matrix",
    mode : "htmlmixed"
  });
  window.onkeyup = function(e){
    e = e || event;
    if(e.keyCode == 46){
      if(!(tree_selected == doc) && tree_selected){tree_selected.remove();tree_selected=null;update_pane();}
    }
  }
  cm_editor.on("blur", function(){
    if(!tree_selected){
      console.log("No tree selected");
      return;}
    if(quick_load){
    tree_selected.inner = cm_editor.getValue();
    if(tree_selected == doc){
      loadHTML(htmlify(doc));
      tree_selected = doc;
      return;
    }
    var child_html = "";
    for(var i=0; i<tree_selected.parent.children.length; i++)child_html += htmlify(tree_selected.parent.children[i]);
    var oparent = tree_selected.parent;
	tree_selected.parent.children = codify(child_html);
	hide_verbose_in(oparent);
    /*
    if(tree_selected.start_tag || tree_selected.display_name == "File"){
      alert("This element has a start tag");
      tree_selected.children = codify(cm_editor.getValue());
      hide_verbose_elements(tree_selected.global_id);
    }
    else{
      alert("This element has no start tag");
      var possible_children = codify(cm_editor.getValue());
      console.log(possible_children);
      tree_selected.replace(possible_children);
    }*/
    }
    else{
    var orig_tree_id = tree_selected.global_id;
    tree_selected.inner = cm_editor.getValue();
    loadHTML(htmlify(doc));
    tree_selected = getElt(orig_tree_id);
    if(tree_selected)cm_editor.setValue("");
    }
    //possess_children(tree_selected);
    update_pane();
  });
  update_pane();
  document.getElementById("addup").onclick = function(e){
    e = e || event;
    if(e.ctrlKey || toggler.className == "on"){
      var user_tag = prompt("Enter a tag name to add");
      var end_tag = "";
      if(confirm("Click ok if it has an end tag. Otherwise click cancel"))end_tag = "/"+user_tag;
      element_chosen = {start_tag:user_tag,end_tag:end_tag,display_name:user_tag};
    }
    addAbove();
    return false;
  }
  document.getElementById("addin").onclick = function(e){
    e = e || event;
    if(e.ctrlKey || toggler.className == "on"){
      var user_tag = prompt("Enter a tag name to add");
      var end_tag = "";
      if(confirm("Click ok if it has an end tag. Otherwise click cancel"))end_tag = "/"+user_tag;
      element_chosen = {start_tag:user_tag,end_tag:end_tag,display_name:user_tag};
    }
    addInside();
    return false;
  }
  document.getElementById("adddown").onclick = function(e){
    e = e || event;
    if(!tree_selected)return;
    if(e.ctrlKey || toggler.className == "on"){
      var user_tag = prompt("Enter a tag name to add");
      var end_tag = "";
      if(confirm("Click ok if it has an end tag. Otherwise click cancel"))end_tag = "/"+user_tag;
      element_chosen = {start_tag:user_tag,end_tag:end_tag,display_name:user_tag};
    }
    addBelow();
    return false;
  }
  document.getElementById("page_loader").onclick = function(){
    document.getElementById("fileselect").click();
  }
  document.getElementById("page_saver").onclick = function(){
    var fname = prompt("Download as? (.html added automatically)");
    if(!fname)return;
    download(fname+".html",htmlify(doc));
  }
  document.getElementById("fileselect").onchange = function(e){
    var file = document.getElementById("fileselect").files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      loadHTML(reader.result);
      hide_verbose_elements();
    };
    reader.readAsText(file);
  }
  toggler = document.getElementById("toggler");
  toggler.onclick = function(e){
    if(toggler.className == "on")toggler.className = "off";
    else toggler.className = "on";
  }
}
window.onload = loadfunc;
if(constant_layout_update)setInterval(function(){
  if(window.innerWidth != last_width || window.innerHeight != last_height)
    loadfunc();
},1000);
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function possess_children(root){
  for(var i=0; i<root.children.length; i++){
    root.children[i].parent = root;
    possess_children(root.children[i]);
  }
}
