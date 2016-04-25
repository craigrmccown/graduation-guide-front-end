angular.module('gg.services')
    .factory('Major', function($http, Environment, Track) {
        function Major(data) {
            data.tracks = data.tracks || [];

            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.tracks = [];
            this.userTracks = [];

            for (var i = 0; i < data.tracks.length; i ++) {
                this.tracks.push(new Track(data.tracks[i]));
            }
        }

        Major.getAll = function() {
            return $http.get(Environment.path + '/majors').then(
                function(response) {
                    var majors = [];

                    for (var i = 0; i < response.data.length; i ++) {
                        majors.push(new Major(response.data[i]));
                    }
                    
                    return majors;
                });
        };

        return Major;
    });
