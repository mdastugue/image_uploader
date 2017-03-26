import $ from 'jquery';
var dataDrop;
document.addEventListener("DOMContentLoaded", function(event) {
    $('.ui-dropdown__link').click(function(e){
        dataDrop =  $(this).data("js"); 
        e.preventDefault();
        $('.ui-dropdown__content' + "." + dataDrop).show();

    });

    $('.ui-list__item-option').click(function(e){
      var ele = document.querySelector('.ui-dropdown__link' + '[data-js="' + dataDrop + '"]' ),
      option = this.getAttribute("data-string"),
      text = ele.innerText.trim() || ele.textContent.trim();
      ele.innerHTML = ele.innerHTML.replace(text,option);
      e.preventDefault();
      $('.ui-dropdown__content' + "." +dataDrop).hide();
    });

    $('body').click(function(e){
        if (!$(e.target).closest('.ui-dropdown__link').length) {
            if($('.ui-dropdown__content' + "." + dataDrop).is(":visible")) {
                $('.ui-dropdown__content' + "." + dataDrop).hide();
            }
    
        }
    });
});
    


