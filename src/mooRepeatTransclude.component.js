/*
  mooRepeatTransclude:

  When you try to use transclude with a custom directive that
  takes and inputs that interpolated DOM nested within an ng-repeat,
  The ng-repeat scope is not respected and you do not have access to repeat scope from
  the transcluded DOM:

  <custom>
    <div>
      {{$index}} <= Will not grab from repeat index if transcluded dom has ng-repeat wraped around it
    </div>
  </custom>

  This directive solves this problem. You use it in a custom directive's template and replace
  ng-transclude with `moo-repeat-transclude`:

  (Directive Template)
  template: `<div class='customDirective' ng-repeat='item in items' moo-repeat-transclude></div>`
*/

let mooRepeatTranscludeComponent = function () {
  return {
    link: function(scope, element, $attrs, controller, transcludeFn) {
      if (!transcludeFn) {
        throw minErr('ngTransclude')('orphan',
         'Illegal use of ngTransclude directive in the template! ' +
         'No parent directive that requires a transclusion found. ' +
         'Element: {0}',
         startingTag(element));
      }
      var innerScope = scope.$new();
      transcludeFn(innerScope, function(clone) {
        element.empty();
        element.append(clone);
        element.on('$destroy', function() {
          innerScope.$destroy();
        });
      });
    }
  };
};

export default mooRepeatTranscludeComponent;
