jQuery(document).ready(function ($) {
    
    var zooeyTM = {
        issues : false,
        
        filteredIssues: [],
        filterByName: [],
        filterByCat: [],

        $magicsearch : $('#magic-search'),
        $tasksLst : $('#tasks-list'),
        $filtersLst: $('#filters-list'),
        $peopleLst: $('#people-list'),
        $catLst: $('#categories-list'),

        $issueTmpl : $('#issue-template').html(),
        $labelTmpl : $('#label-template').html(),
        $peopleTmpl : $('#people-template').html(),
        $catTmpl : $('#categories-template').html(),
        
        _init: function() {
            var that = this;

            this._getIssues();
            
        },
        _getIssues: function() {
            var that = this;

            $.ajax({
                url: 'issues.json',
                dataType: 'json',
                type: 'GET',
                success: function(response) {
                    that.issues = response;
                    that._createList(that.issues);
                    that._peopleList();
                    that._catList();

                    that._bindEvents();
                }
            });
        },
        _createList: function(issues) {
            var that = this;

            this._filterLabels();
            this.$tasksLst.html(_.template(that.$issueTmpl, { items: issues }));
            
        },
        _peopleList: function() {
            var that = this,
                people = [];

            _.each(this.issues, function(elem){
                if ($.inArray(elem.assignee, people) == -1) {
                    people.push(elem.assignee);
                }
            });

            this.$peopleLst.html(_.template(that.$peopleTmpl, { items: people }));            
        },
        _catList: function() {
            var that = this,
                categories = [];

            _.each(this.issues, function(elem){
                if ($.inArray(elem.category, categories) == -1) {
                    categories.push(elem.category);
                }
            });

            this.$catLst.html(_.template(that.$catTmpl, { items: categories }));            
        },
        _addFilter: function(type, text) {
            if (type == 'category') {
                if ($.inArray(text, this.filterByCat) > -1) {
                   this.filterByCat = this._removeFilter(this.filterByCat, text);
                } else {
                    this.filterByCat.push(text);
                }
            } 
            else if (type == 'assignee') {
                if ($.inArray(text, this.filterByName) > -1) {
                   this.filterByName = this._removeFilter(this.filterByName, text);
                } else {
                    this.filterByName.push(text);
                }
            }
            
            
            this._filterIssues();

        },
        _filterLabels: function() {
            var that = this,
                labels = [];

            if (this.filterByName.length) {
                _.each(this.filterByName, function(elem){
                    var obj = {
                        'type': 'assignee',
                        'label': elem
                    }

                    labels.push(obj);
                });
            }

            if (this.filterByCat.length) {
                _.each(this.filterByCat, function(elem){
                    var obj = {
                        'type': 'category',
                        'label': elem
                    }

                    labels.push(obj);
                });
            }


            this.$filtersLst.html(_.template(that.$labelTmpl, { items: labels }));
        },
        _removeFilter: function(array, text) {
            return _.filter(array, function(x) { return x != text });
        },
        _filterIssues: function() {
            var that = this,
                obj = this.issues,
                matches;

                this.filteredIssues = obj.filter(function(x) {
                    return _.indexOf(that.filterByName, x.assignee) > -1 || _.indexOf(that.filterByCat, x.category) > -1;
                });

                matches = this.filteredIssues.length ? this.filteredIssues : obj;
                
                that._createList(matches);
               
        },
        _bindEvents: function() {
            var that = this;

            $(document).on('click', '.more', function(ev) {
                ev.preventDefault();

                var $this = $(this),
                    $task = $this.closest('.task'),
                    $description = $task.find('.description');

                    $description.slideToggle();

            });

            $(document).on('click', '.btn-filter', function(ev) {
                ev.preventDefault();

                var $this = $(this),
                    type = $this.attr('data-filter'),
                    text = $this.attr('data-label');

                that.$magicsearch.val('');
                that._addFilter(type, text);
                    

            });

            $(document).on('keyup', '#magic-search', function(ev) {
                ev.preventDefault();

                var $this = $(this),
                    val = $this.val().toLowerCase(),
                    obj = that.filteredIssues.length ? that.filteredIssues : that.issues,
                    matches;

                
                matches = obj.filter(function(x) {
                    var assignee = x.assignee || 'Unassigned',
                        category = x.category || 'Uncategorized',
                        project = x.project || 'Untitled project';

                    return assignee.toLowerCase().indexOf(val) > -1 || category.toLowerCase().indexOf(val) > -1 || project.toLowerCase().indexOf(val) > -1;
                });
                
                that._createList(matches);
                    

            });

        }
    }

    zooeyTM._init();
});