
function adjust_icon_bar(){
    // this function will adjust the icon-bar based on the number of the icons in it
    var number_of_buttons = $(".icon-button").length; 
    var icon_bar_length = (number_of_buttons * 51 + 5 ) + 10 + 10 ; // 51 is length + 5 is padding, + 10 padding top + 10 padding down
    $("div.icon-bar").css("height", icon_bar_length + "px" );
    $("div.icon-bar").css("z-index", 1);
}
adjust_icon_bar();