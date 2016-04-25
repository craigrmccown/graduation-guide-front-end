angular.module('gg.services')
    .factory('User', function($http, Environment, Major, Minor, Track, Course) {
        function User(data) {
            data.majors = data.majors || [];
            data.minors = data.minors || [];
            data.tracks = data.tracks || [];
            data.completedCourses = data.completedCourses || [];

            this.id = data.id;
            this.email = data.email;
            this.majors = [];
            this.minors = [];
            this.tracks = [];
            this.completedCourses = [];

            for (var i = 0; i < data.majors.length; i ++) {
                this.majors.push(new Major(data.majors[i]));
            }

            for (var i = 0; i < data.minors.length; i ++) {
                this.minors.push(new Minor(data.minors[i]));
            }

            for (var i = 0; i < data.tracks.length; i ++) {
                this.tracks.push(new Track(data.tracks[i]));
            }

            for (var i = 0; i < data.completedCourses.length; i ++) {
                this.completedCourses.push(new Track(data.completedCourses[i]));
            }
        }

        User.getCurrent = function() {
            return $http.get(Environment.path + '/auth/whoami').then(
                function(response) {
                    return new User(response.data);
                }
            );
        };

        User.prototype.addMajor = function(major) {
            this.majors.push(major);
        };

        User.prototype.findMajorById = function(id) {
            return _.findWhere(this.majors, { id: id })
        };

        User.prototype.removeMajorById = function(id) {
            this.majors = _.filter(this.majors, function(major) {
                return major.id != id;
            })
        };

        User.prototype.addTrack = function(track) {
            this.tracks.push(track);
        };

        User.prototype.findTrackById = function(id) {
            return _.findWhere(this.tracks, { id: id })
        };

        User.prototype.removeTrackById = function(id) {
            this.tracks = _.filter(this.tracks, function(track) {
                return track.id != id;
            });
        };

        User.prototype.addMinor = function(minor) {
            this.minors.push(minor);
        };

        User.prototype.findMinorById = function(id) {
            return _.findWhere(this.minors, { id: id })
        };

        User.prototype.removeMinorById = function(id) {
            this.minors = _.filter(this.minors, function(minor) {
                return minor.id != id;
            });
        };

        User.prototype.saveMajors = function() {
            return $http.put(Environment.path + '/majors', this.majors);
        };

        User.prototype.saveTracks = function() {
            return $http.put(Environment.path + '/tracks', this.tracks);
        };

        User.prototype.saveMinors = function() {
            return $http.put(Environment.path + '/minors', this.minors);
        };

        User.prototype.getMajorTracks = function (major) {
            var majorTracks = [];
            var maj = _.findWhere(this.majors, { id: major.id });
            if (maj) {
                majorTracks = _.filter(this.tracks, function(track) {
                    return track.majorId != maj.id;
                });
            }
            return majorTracks;
        };

        User.prototype.queryPrereqs = function () {
            var self = this;
            return $http.get(Environment.path + '/prereqs')
                .then(function (response) {
                    var prereqs = [];
                    if (response && response.data && response.data.length) {
                        for (var i = 0; i < response.data.length; i++) {
                            prereqs.push(response.data[i]);
                        }
                    }
                    //RESET
                    self.prereqs = prereqs;
                    return prereqs;
                });
        };

        User.prototype.queryRequirements = function () {
            var self = this;
            return $http.get(Environment.path + '/requirements')
                .then(function (response) {
                    var reqs = [];
                    if (response && response.data && response.data.length) {
                        for (var i = 0; i < response.data.length; i++) {
                            if (!response.data[i].isSatisfied) {
                                reqs.push(response.data[i]);
                            }
                        }
                    }

                    //RESET
                    self.requirements = reqs;
                    return reqs;
                })
        };

        User.prototype.queryCompletedCourses = function () {
            var self = this;
            return $http.get(Environment.path + '/courses/completed')
                .then(function (response) {
                    var completedCourses = [];
                    if (response && response.data && response.data.length) {
                        for (var i = 0; i < response.data.length; i++) {
                            completedCourses.push(new Course(response.data[i]));
                        }
                    }
                    //RESET
                    self.completedCourses = completedCourses;
                    return completedCourses;
                })
        };

        User.prototype.saveCompletedCourses = function() {
            return $http.put(Environment.path + '/courses/completed', this.completedCourses);
        };

        return User;
    });
