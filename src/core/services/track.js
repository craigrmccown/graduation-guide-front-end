angular.module('gg.services')
    .factory('Track', function() {
        function Track(data) {
            this.id = data.id;
            this.majorId = data.majorId;
            this.name = data.name;
            this.description = data.description;
        }

        return Track;
    });
