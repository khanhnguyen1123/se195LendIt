angular.module('storyCtrl', ['storyService'])


	.controller('StoryController', function(Story) {


		var vm = this;

		Story.all()
			.success(function(data) {
				vm.stories = data;
			});


		vm.createStory = function() {

			vm.processing = true;

   
			vm.message = '';
			Story.create(vm.storyData)
				.success(function(data) {
					vm.processing = false;
					//clear up the form
					vm.storyData = {};

					vm.message = data.message;

					
				});

		};

		
		







});