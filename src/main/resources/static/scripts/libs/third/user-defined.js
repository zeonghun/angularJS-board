/*
 - 
 - FileName	: user-defined.js
 - Package	: libs/third
 - 
 - 
 - Date  	: 2022. 07. 12. 오후 1:30:00
 - Author	: jwlee
 - Email	: jwlee@ymtech.co.kr
 */

 /**
  * Loading Masking Class
  * 
  *  - example
 
    <div ng-show="!masking.isFinish" class="ym-masking animationIf">
        <div class="loaderDiv">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <span>Loading</span>
        </div>
    </div>

    $scope.masking = new LoadingMasking();
    $scope.masking.setMasking();
    $scope.masking.forceFreeMasking();
    
  * 
  * @author jwlee
  * @since 2022. 07. 12.
  */
class LoadingMasking {
    constructor($scope) {
        this.count = 0;
        this.isFinish = true;
        this.$scope = $scope;
    }

    setMasking() {
        this.count++;
        this.isFinish = false;
    }

    freeMasking() {
        if (this.count > 0) {
            this.count--;
            if (this.count <= 0) {
                this.isFinish = true;
            }
        }
        if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
            this.$scope.$apply();
        }
    }

    forceFreeMasking() {
        this.count = 0;
        this.isFinish = true;
    }

    isFinished() {
        console.debug("isFinished, count: ", this.count, ", this.isFinish: ", this.isFinish);
        return this.isFinish;
    }
}