angular.module('gg.mock', ['gg.app', 'ngMockE2E'])
    .run(function($httpBackend) {
        var USER_EMAIL = 'craigrmccown@gmail.com';
        var userMajors = localStorage.getItem('user.majors');
        var userTracks = localStorage.getItem('user.tracks');
        var userMinors = localStorage.getItem('user.minors');

        var user = {
            id: 100,
            email: USER_EMAIL,
            majors: userMajors ? angular.fromJson(userMajors) : [],
            tracks: userTracks ? angular.fromJson(userTracks) : [],
            minors: userMinors ? angular.fromJson(userMinors) : []
        };

        var majors = [
            {
                'id': 100,
                'name': 'Computer Science',
                'description': 'Computational theory, software design, and analysis of algorithms.',
                'tracks': []
            },
            {
                'id': 101,
                'name': 'Electrical Engineering',
                'description': 'Analog electronics, digital signal processing, and telecommunications.',
                'tracks': []
            }
        ];

        var tracks = [
            {
                'id': 100,
                'majorId': 100,
                'name': 'Information Internetworks',
                'description': 'Computer networking, internet technologies, data storage, and security.'
            },
            {
                'id': 101,
                'majorId': 100,
                'name': 'Systems & Architecture',
                'description': 'Operating systems, instruction set architectures, and processors.'
            }
        ];

        var minors = [
            {
                'id': 100,
                'name': 'Biology',
                'description': 'Evolution, anatomy, ecosystems, and organic chemistry.'
            },
            {
                'id': 101,
                'name': 'Music',
                'description': 'Music theory, instruments, and digital production.'
            }
        ];

        var courses = [
            {
                'id': 100,
                'name': 'CS 1331',
                'description': 'Object oriented programming'
            },
            {
                'id': 101,
                'name': 'CS 1332',
                'description': 'Data structures and algorithms'
            },
            {
                'id': 102,
                'name': 'CS 3251',
                'description': 'Networking I'
            },
            {
                'id': 103,
                'name': 'MATH 3012',
                'description': 'Combinatorics'
            },
            {
                'id': 104,
                'name': 'CS 3510',
                'description': 'Design and analysis of algorithms'
            },
            {
                'id': 105,
                'name': 'CS 4240',
                'description': 'Compilers and interpreters'
            },
            {
                'id': 106,
                'name': 'CS 4210',
                'description': 'Advanced operating systems'
            }
        ];

        var sections = [
            {
                'id': 100,
                'courseId': 102,
                'crn': 10897,
                'professor': 'Bill Leahy',
                'times': 'MWF 1:05 - 1:55'
            },
            {
                'id': 101,
                'courseId': 102,
                'crn': 21947,
                'professor': 'Russ Clark',
                'times': 'TR 9:35 - 10:55'
            },
            {
                'id': 102,
                'courseId': 103,
                'crn': 37291,
                'professor': 'William Trotter',
                'times': 'MWF 12:05 - 12:55'
            },
            {
                'id': 103,
                'courseId': 104,
                'crn': 10233,
                'professor': 'H. Venkateswaran',
                'times': 'MWF 3:05 - 3:55'
            },
            {
                'id': 104,
                'courseId': 104,
                'crn': 92821,
                'professor': 'H. Venkateswaran',
                'times': 'TR 12:05 - 1:25'
            },
            {
                'id': 105,
                'courseId': 104,
                'crn': 37291,
                'professor': 'Merrick Furst',
                'times': 'MWF 8:05 - 8:55'
            }
        ];

        for (var i = 0; i < tracks.length; i ++) {
            var track = tracks[i];
            var major = _.find(majors, function(major) {
                return tracks[i].majorId == major.id;
            });

            major.tracks.push(track);
        }

        function authenticate() {
            var loggedIn = window.localStorage.getItem('user.loggedIn');

            if (!loggedIn) {
                return false;
            }

            var parsed = Date.parse(loggedIn);

            if (new Date() - parsed > 10800000) {
                window.localStorage.removeItem('user.loggedIn');
                return false;
            }

            return true;
        }

        $httpBackend.whenGET(/^\/views\//).passThrough();
        $httpBackend.whenGET(/^\/assets\//).passThrough();
        $httpBackend.whenGET(/^\/templates\//).passThrough();
        $httpBackend.whenGET(/\.html/).passThrough();

        $httpBackend.whenPOST(/^\/auth\/login$/).respond(
            function(method, url, data, headers, params) {
                var json = angular.fromJson(data);

                if (json.email != USER_EMAIL || json.password != 'password123') {
                    return [401, {}, {}];
                }

                window.localStorage.setItem('user.loggedIn', new Date().toISOString());
                return [200, {}, {}];
            }
        );

        $httpBackend.whenPOST(/^\/users$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, {}, {}];
            }
        );

        $httpBackend.whenGET(/^\/users\/me$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, user, {}];
            }
        );

        $httpBackend.whenGET(/^\/majors$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, majors, {}];
            }
        );

        $httpBackend.whenGET(/^\/minors$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, minors, {}];
            }
        );

        $httpBackend.whenGET(/^\/courses$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, courses, {}];
            }
        );

        $httpBackend.whenPOST(/^\/users\/me\/majors$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }

                var json = angular.fromJson(data);
                user.majors = [];

                for (var i = 0; i < json.length; i ++) {
                    user.majors.push(
                        _.find(majors, function(major) {
                            return major.id == json[i].id;
                        })
                    );
                }

                window.localStorage.setItem('user.majors', angular.toJson(user.majors));
                return [200, {}, {}];
            }
        );

        $httpBackend.whenPOST(/^\/users\/me\/tracks$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }

                var json = angular.fromJson(data);
                user.tracks = [];

                for (var i = 0; i < json.length; i ++) {
                    user.tracks.push(
                        _.find(tracks, function(track) {
                            return track.id == json[i].id;
                        })
                    );
                }

                window.localStorage.setItem('user.tracks', angular.toJson(user.tracks));
                return [200, {}, {}];
            }
        );

        $httpBackend.whenPOST(/^\/users\/me\/minors$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }

                var json = angular.fromJson(data);
                user.minors = [];

                for (var i = 0; i < json.length; i ++) {
                    user.minors.push(
                        _.find(minors, function(minor) {
                            return minor.id == json[i].id;
                        })
                    );
                }

                window.localStorage.setItem('user.minors', angular.toJson(user.minors));
                return [200, {}, {}];
            }
        );

        $httpBackend.whenGET(/^\/sections$/).respond(
            function(method, url, data, headers, params) {
                if (!authenticate()) { return [401, {}, {}]; }
                return [200, sections, {}];
            }
        );
    });

angular.bootstrap(document, ['gg.mock']);
