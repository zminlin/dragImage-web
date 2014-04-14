angular.module('ngDragDrop', [])
.run(['$rootScope',function ($rootScope) {
	$rootScope.photo_id=0;
}])
.factory('deliverSer', ['$rootScope',function ($rootScope) {
	var factory = [];
	factory.pics = {};
	
	factory.updatePics = function (data) {
		factory.pics = data;
		$rootScope.$broadcast('updatePics');
	}
	factory.addPics = function () {
		$rootScope.photo_id = $rootScope.photo_id + 1;
	}
	factory.getID =function () {
		return $rootScope.photo_id;
	}
	
	return factory;
}])
.directive('dragable', [function () {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			var el= iElement[0];
			//console.log(iElement);
			el.draggable = true;
			utils.addListener (el, 'dragstart', function (e) {
				//console.log(e);
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('Text', this.id);
				//console.log(this);
				this.classList.add('drag');
				return false;
			});

			utils.addListener (el, 'dragend', function (e) {
				this.classList.remove('drag');
				return false;
			});
		}
	};
}]).directive('dropable', ['deliverSer','$filter',function (deliverSer,$filter) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			var el = iElement[0];
			
			utils.addListener(el, 'dragover', function (e) {
				e.dataTransfer.dropEffect = 'move';
				if(e.preventDefault) {
					e.preventDefault();
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				this.classList.add('over');
				return false;
			});
			utils.addListener(el, 'dragenter' ,function (e) {
				this.classList.add('over');
				//console.log(e);
				return false;
			});
			utils.addListener(el, 'dragleave' ,function (e) {
				this.classList.remove('over');
				return false;
			});
			utils.addListener(el, 'drop' ,function (e) {
				var dropBox=this;
				//console.log(this);
				if(e.preventDefault) {
					e.preventDefault();
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				}
				this.classList.remove('over');
				/** drop html tag item
				var item = document.getElementById(e.dataTransfer.getData('Text'));
				this.appendChild(item);
				**/
				/**local image getting**/
				var fileList=e.dataTransfer.files;
				//console.log(e);
				for(var i=0;i<fileList.length;i++){
					if( fileList[i].type.indexOf('image')==-1){
					alert("not support");
					return;
					}
				}
				//console.log('fileList is image');

				var pics=[];
				var loadedImgNum = fileList.length;

				for(var i=0; i<fileList.length;i++){
					fileList[i].id = deliverSer.getID();
					pics.push(fileList[i]);		
					deliverSer.addPics();//upload pic_id	
				
				}
				deliverSer.updatePics(pics);
				
				function imageLoader(e) {
					//console.log(e);
					var img= document.getElementById('photo_id_'+e.target.index);					
					img.src = e.target.result;

				}
				return false;
			});
		}
	};
}])
.controller('albumCtrl', ['$scope','deliverSer','$filter','$parse', function ($scope,deliverSer,$filter,$parse) {
	$scope.photo_view = false;
	$scope.photo_view_list = [];
	$scope.albums=[
		{
			id:0,name:'album1',on:true,
			pics:[]
		},
		{
			id:1,name:'album3',on:false,
			pics:[]
		},
		{
			id:2,name:'album5',on:false,
			pics:[]
		},
	];
	var item = $scope.albums[0];//selected albums
	$scope.handleDrop = function () {
		alert('drop');
	};
	$scope.selectAlbum = function (val) {
		var cleanItem = $filter('filter')($scope.albums,{on:true});
		if(cleanItem.length > 0) {
			cleanItem[0].on = false;
		}
		item = $filter('filter')($scope.albums,{id:val})[0];
		item.on = true;
		//console.log($scope.albums);

	}

	$scope.showImg = function () {
		$scope.photo_view = true;
		$scope.photo_view_list = $filter('filter')($scope.albums,{on:true})[0];
		var reader = new FileReader();
		utils.addListener(reader,'load', function (e) {
			var img= document.getElementById('photo_view');					
			img.src = e.target.result;
		});
		reader.readAsDataURL(this.pic);

		//console.log(this);
	};
	$scope.showAlbums= function () {
		$scope.photo_view = false;
		var img= document.getElementById('photo_view');					
		img.src = "";
	};
	$scope.$on('updatePics',function (result) {
		angular.forEach(deliverSer.pics, function (val, key){
			item.pics.push(val);
		});
		//console.log($scope.albums);
		
		$scope.$apply();
		var index = item.pics.length - deliverSer.pics.length;
		console.log( index);
		for( ; index < item.pics.length ; index++ ){
			var img = document.getElementById('photo_id_'+item.pics[index].id);
			console.log(img);
			img.src = window.URL.createObjectURL(item.pics[index]);
			img.onload = function (e) {
				window.URL.revokeObjectURL(this.src);
			}
		}
	});
	
}])
