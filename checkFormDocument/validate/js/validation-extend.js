/**
 * Created by 飞 on 2015/3/31.
 */
/**
 * Created by mengchen on 2015/3/30.
 */
(function($) {
    "use strict";

    if (!$) {
        throw new ReferenceError("please import jQuery First.");
    }

    var regexObj = {
            email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g,
            mobile:/^\d{11}$/
        };

    var ajaxValidate = function(url, param) {
        var result = false;
        $.ajax({
            url : url,
            dataType : "json",
            async : false,
            data : param,
            success : function(data) {
                result = !data.result;
            }
        });
        return result;
    };

    $.fn.extend({
        initValidate:function() {
            var $validateForm = this;
            var $elements = $validateForm.find("input[validate]");
            var validateFuncs = [];

            $elements.each(function (index, element) {
                var validateObj = eval("({" + $(element).attr("validate") + "})");
                var validateFunc = function () {

                    var result = false;

                    var ajaxParam = {};
                    if (validateObj.ajax) {
                        ajaxParam[validateObj.ajax.paramName] = $(element).val();
                    }
                    var ajaxValidateResult = true;

                    if ((validateObj.required || $(element).val()) && (
                        (validateObj.required && !$(element).val())
                        || (validateObj.regex && !(new RegExp(validateObj.regex).test($(element).val())))
                        || (validateObj.equalTo && $(element).val() != $("#" + validateObj.equalTo).val())
                        || validateObj.ajax && !(ajaxValidateResult = ajaxValidate(validateObj.ajax.url, ajaxParam))
                        || (validateObj.type && !(new RegExp(regexObj[validateObj.type]).test($(element).val())))
                        )) {

                        $(element).removeClass("success").addClass("danger");
                        $(element).parent().next().html("<span class='warning-image'></span><span class='ks-red' style='font-size: 12px;padding-left: 3px'>" +
                        (ajaxValidateResult ? $(element).attr("placeholder") : validateObj.ajax.errorMessage) +
                        "</span>");
                    } else {
                        $(element).removeClass("danger").addClass("success");
                        $(element).parent().next().html("<span class='ok-image'></span><span class='ks-green'style='font-size: 12px;padding-left: 3px'>成功</span>");
                        result = true;
                    }

                    return result;
                };

                validateFuncs[index] = validateFunc;
                $(element).bind("blur", validateFunc);
            });
            this.data("validateFuncs", validateFuncs);
            this.data("elementsCount", $elements.length);
        }
    });
    $.fn.extend({
        doValidate: function(){
            var validateFuncs = this.data("validateFuncs");
            var elementCount = this.data("elementsCount");
            var passedElementCount = 0;
            for (var i = 0; i < validateFuncs.length; i++) {
                if (validateFuncs[i]()) {
                    passedElementCount++;
                }
            }
            return passedElementCount == elementCount;
        }
    })

})(window.jQuery);