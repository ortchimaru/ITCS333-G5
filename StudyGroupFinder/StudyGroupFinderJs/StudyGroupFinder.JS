class StudyGroupFinder {
    constructor() {
        // DOM elements
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error-message');
        this.groupsContainer = document.getElementById('groups-container');
        this.paginationElement = document.getElementById('pagination');
        
        // State variables
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentSort = 'newest';
        this.currentGroupId = null;
        this.groups = [];
        
        // Initialize the app
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadStudyGroups();
        this.showSection('listing');
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });
        
        // Search and filters
        document.getElementById('search-input')?.addEventListener('input', () => {
            this.currentPage = 1;
            this.filterAndRenderGroups();
        });
        
        document.getElementById('course-filter')?.addEventListener('change', () => {
            this.currentPage = 1;
            this.filterAndRenderGroups();
        });
        
        document.getElementById('day-filter')?.addEventListener('change', () => {
            this.currentPage = 1;
            this.filterAndRenderGroups();
        });
        
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSort = e.target.dataset.sort;
                this.filterAndRenderGroups();
            });
        });
        
        // Forms
        document.getElementById('create-group-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndCreateGroup();
        });
        
        document.getElementById('comment-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.postComment();
        });
    }
    
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });
        
        // Show requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            
            // Check if we're showing detail without a group
            if (sectionId === 'detail' && !this.currentGroupId) {
                this.showSection('listing');
            }
        }
    }
    
    async loadStudyGroups() {
        this.showLoading(true);
        
        try {
            // Try to fetch data from the API
            const response = await fetch('https://jsonplaceholder.typicode.com/posts')
                .catch(error => {
                    console.error('Fetch error:', error);
                    throw new Error('Network error');
                });
            
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            
            // Store groups for future filtering
            this.groups = this.getFallbackGroups(); // Using fallback data as specified
            this.filterAndRenderGroups();
            
        } catch (error) {
            console.error('Error loading study groups:', error);
            this.showError('Failed to load study groups. Please try again later.');
            
            // Use fallback data on error
            this.groups = this.getFallbackGroups();
            this.filterAndRenderGroups();
        } finally {
            this.showLoading(false);
        }
    }
    
    filterAndRenderGroups() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const courseValue = document.getElementById('course-filter')?.value || '';
        const dayValue = document.getElementById('day-filter')?.value || '';
        
        // Apply filters
        let filteredGroups = this.groups.filter(group => {
            const matchesSearch = searchTerm === '' || 
                group.name.toLowerCase().includes(searchTerm) || 
                group.description.toLowerCase().includes(searchTerm);
            
            const matchesCourse = courseValue === '' || group.course === courseValue;
            const matchesDay = dayValue === '' || group.meetingDay === dayValue;
            
            return matchesSearch && matchesCourse && matchesDay;
        });
        
        // Apply sorting
        switch (this.currentSort) {
            case 'newest':
                filteredGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'members':
                filteredGroups.sort((a, b) => b.members - a.members);
                break;
            case 'meeting':
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                filteredGroups.sort((a, b) => days.indexOf(a.meetingDay) - days.indexOf(b.meetingDay));
                break;
        }
        
        this.renderGroups(filteredGroups);
        this.renderPagination(filteredGroups.length);
    }
    
    renderGroups(groups) {
        if (!this.groupsContainer) return;
        
        this.groupsContainer.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedGroups = groups.slice(startIndex, startIndex + this.itemsPerPage);
        
        if (paginatedGroups.length === 0) {
            this.groupsContainer.innerHTML = '<p>No study groups found matching your criteria.</p>';
            return;
        }
        
        // Create group cards
        paginatedGroups.forEach(group => {
            const groupCard = document.createElement('article');
            groupCard.className = 'group-card';
            groupCard.innerHTML = `
                <header>
                    <h3>${group.name}</h3>
                    <p>${group.course}</p>
                </header>
                <p>${group.description}</p>
                <footer>
                    <p><small>Next meeting: ${group.meetingDay}, ${group.meetingTime} · ${group.members} members</small></p>
                    <a href="#" class="view-detail" data-group-id="${group.id}" role="button">View Details</a>
                </footer>
            `;
            
            // Add click event to view details
            groupCard.querySelector('.view-detail').addEventListener('click', (e) => {
                e.preventDefault();
                this.currentGroupId = e.target.dataset.groupId;
                this.loadGroupDetails(this.currentGroupId);
                this.showSection('detail');
            });
            
            this.groupsContainer.appendChild(groupCard);
        });
    }
    
    renderPagination(totalItems) {
        if (!this.paginationElement) return;
        
        this.paginationElement.innerHTML = '';
        
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        if (totalPages <= 1) return;
        
        // Previous button
        if (this.currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = '← Previous';
            prevButton.addEventListener('click', () => {
                this.currentPage--;
                this.filterAndRenderGroups();
            });
            this.paginationElement.appendChild(prevButton);
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === this.currentPage) {
                pageButton.classList.add('active-pagination');
            }
            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.filterAndRenderGroups();
            });
            this.paginationElement.appendChild(pageButton);
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next →';
            nextButton.addEventListener('click', () => {
                this.currentPage++;
                this.filterAndRenderGroups();
            });
            this.paginationElement.appendChild(nextButton);
        }
    }
    
    loadGroupDetails(groupId) {
        this.showLoading(true);
        
        try {
            // Find the selected group
            const group = this.groups.find(g => g.id === groupId);
            
            if (!group) {
                throw new Error('Group not found');
            }
            
            // Render group details
            this.renderGroupDetails(group);
            
            // Load comments
            this.loadComments(groupId);
            
        } catch (error) {
            console.error('Error loading group details:', error);
            this.showError('Failed to load group details.');
            this.showSection('listing');
        } finally {
            this.showLoading(false);
        }
    }
    
    renderGroupDetails(group) {
        const detailElement = document.getElementById('group-detail');
        if (!detailElement) return;
        
        detailElement.innerHTML = `
            <header>
                <h2>${group.name}</h2>
                <p>${group.course} · ${group.members} members</p>
            </header>
            
            <div class="grid">
                <div>
                    <h4>Description</h4>
                    <p>${group.description}</p>
                    
                    <h4>Schedule</h4>
                    <p>Every ${group.meetingDay} at ${group.meetingTime}</p>
                    
                    <h4>Location</h4>
                    <p>${group.location}</p>
                </div>
                
                <div>
                    <h4>Organizer</h4>
                    <p>${group.organizer} (${group.organizerEmail})</p>
                    
                    <h4>Created</h4>
                    <p>${new Date(group.createdAt).toLocaleDateString()}</p>
                    
                    <h4>Tags</h4>
                    <p>${group.tags?.map(tag => `#${tag}`).join(' ') || ''}</p>
                </div>
            </div>
            
            <footer>
                <div class="grid">
                    <button id="join-group-btn">Join Group</button>
                </div>
            </footer>
        `;
        
        // Add event listener for join button
        document.getElementById('join-group-btn')?.addEventListener('click', () => {
            alert(`You've joined ${group.name}!`);
        });
    }
    
    loadComments(groupId) {
        try {
            // Get comments for this group
            const comments = this.getFallbackComments(groupId);
            this.renderComments(comments);
        } catch (error) {
            console.error('Error loading comments:', error);
            const commentsContainer = document.getElementById('comments-container');
            if (commentsContainer) {
                commentsContainer.innerHTML = '<p>Failed to load comments.</p>';
            }
        }
    }
    
    renderComments(comments) {
        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <p class="comment-author">${comment.author} · ${this.formatTimeAgo(comment.createdAt)}</p>
                <p>${comment.text}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }
    
    postComment() {
        const commentInput = document.getElementById('new-comment');
        if (!commentInput) return;
        
        const commentText = commentInput.value.trim();
        
        // Validate comment
        if (!commentText) {
            const errorElement = document.getElementById('comment-error');
            if (errorElement) {
                errorElement.textContent = 'Please enter a comment';
            }
            return;
        }
        
        // Clear error if present
        const errorElement = document.getElementById('comment-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        this.showLoading(true);
        
        try {
            // Create new comment
            const newComment = {
                id: `comment-${Date.now()}`,
                groupId: this.currentGroupId,
                author: 'Current User',
                text: commentText,
                createdAt: new Date().toISOString()
            };
            
            // Since we're using fallback data, add the comment locally
            const comments = this.getFallbackComments(this.currentGroupId);
            comments.push(newComment);
            
            // Simulate the POST request
            fetch('https://jsonplaceholder.typicode.com/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            }).catch(err => console.log('API call simulation:', err));
            
            // Clear input and render comments
            commentInput.value = '';
            this.renderComments(comments);
            
        } catch (error) {
            console.error('Error posting comment:', error);
            this.showError('Failed to post comment.');
        } finally {
            this.showLoading(false);
        }
    }
    
    validateAndCreateGroup() {
        // Get form values
        const nameInput = document.getElementById('group-name');
        const courseSelect = document.getElementById('course');
        const descriptionTextarea = document.getElementById('description');
        const meetingDaySelect = document.getElementById('meeting-day');
        const meetingTimeInput = document.getElementById('meeting-time');
        const locationInput = document.getElementById('location');
        
        if (!nameInput || !courseSelect || !descriptionTextarea || 
            !meetingDaySelect || !meetingTimeInput || !locationInput) {
            return;
        }
        
        const name = nameInput.value.trim();
        const course = courseSelect.value;
        const description = descriptionTextarea.value.trim();
        const meetingDay = meetingDaySelect.value;
        const meetingTime = meetingTimeInput.value;
        const location = locationInput.value.trim();
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });
        
        // Simple validation
        let isValid = true;
        
        if (!name) {
            document.getElementById('group-name-error').textContent = 'Group name is required';
            isValid = false;
        }
        
        if (!course) {
            document.getElementById('course-error').textContent = 'Course is required';
            isValid = false;
        }
        
        if (!description) {
            document.getElementById('description-error').textContent = 'Description is required';
            isValid = false;
        } else if (description.length < 20) {
            document.getElementById('description-error').textContent = 'Description should be at least 20 characters';
            isValid = false;
        }
        
        if (!meetingDay) {
            document.getElementById('meeting-day-error').textContent = 'Meeting day is required';
            isValid = false;
        }
        
        if (!meetingTime) {
            document.getElementById('meeting-time-error').textContent = 'Meeting time is required';
            isValid = false;
        }
        
        if (!location) {
            document.getElementById('location-error').textContent = 'Location is required';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Create the group
        this.createStudyGroup({
            name,
            course,
            description,
            meetingDay,
            meetingTime,
            location
        });
    }
    
    createStudyGroup(groupData) {
        this.showLoading(true);
        
        try {
            // Create new group object
            const newGroup = {
                ...groupData,
                id: `group-${Date.now()}`,
                members: 1,
                organizer: 'Current User',
                organizerEmail: 'user@university.edu',
                createdAt: new Date().toISOString(),
                tags: ['study', groupData.course.toLowerCase().replace(' ', '-')]
            };
            
            // Simulate API call
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGroup)
            }).catch(err => console.log('API call simulation:', err));
            
            // Add to local data
            this.groups.unshift(newGroup);
            
            // Show success message
            alert(`Study group "${newGroup.name}" created successfully!`);
            
            // Reset form
            document.getElementById('create-group-form')?.reset();
            
            // Go to listing and show updated groups
            this.showSection('listing');
            this.filterAndRenderGroups();
            
        } catch (error) {
            console.error('Error creating study group:', error);
            this.showError('Failed to create study group.');
        } finally {
            this.showLoading(false);
        }
    }
    
    showLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.classList.toggle('hidden', !show);
        }
    }
    
    showError(message) {
        console.error('ERROR:', message);
        
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.classList.remove('hidden');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                this.errorElement.classList.add('hidden');
            }, 5000);
        }
    }
    
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }
    
    // Fallback data
    getFallbackGroups() {
        return [
            {
                id: 'group1',
                name: 'CS 101 Study Group',
                course: 'Computer Science',
                description: 'Weekly meetups to review algorithms and data structures. All skill levels welcome!',
                meetingDay: 'Monday',
                meetingTime: '3:00 PM',
                location: 'S40-2046',
                members: 12,
                organizer: 'Sami Ali',
                organizerEmail: 'Sami.Ali@stu.uob.edu.bh',
                createdAt: '2025-09-12T10:00:00Z',
                tags: ['algorithms', 'programming', 'beginner-friendly']
            },
            {
                id: 'group2',
                name: 'Calculus Study Group',
                course: 'Mathematics',
                description: 'Collaborative problem solving for Calculus II. Bring your questions!',
                meetingDay: 'Wednesday',
                meetingTime: '2:00 PM',
                location: 'Math Building 203',
                members: 8,
                organizer: 'Ali Hassan',
                organizerEmail: 'Ali.Hassan@stu.uob.edu.bh',
                createdAt: '2025-09-05T14:30:00Z',
                tags: ['calculus', 'math', 'problem-solving']
            },
            {
                id: 'group3',
                name: 'Physics Study Group',
                course: 'Physics',
                description: 'Preparing for midterm exams together. We cover all chapters.',
                meetingDay: 'Friday',
                meetingTime: '4:00 PM',
                location: 'Physics Lab B',
                members: 5,
                organizer: 'Fatima Ahmed',
                organizerEmail: 'Fatima.Ahmed@stu.uob.edu.bh',
                createdAt: '2025-08-28T09:15:00Z',
                tags: ['physics', 'exams', 'midterms']
            },
            {
                id: 'group4',
                name: 'Engineering Fundamentals',
                course: 'Engineering',
                description: 'Study group for first-year engineering students covering all core subjects.',
                meetingDay: 'Tuesday',
                meetingTime: '1:00 PM',
                location: 'Engineering Building 105',
                members: 15,
                organizer: 'Khalid Mohammed',
                organizerEmail: 'Khalid.Mohammed@stu.uob.edu.bh',
                createdAt: '2025-09-01T11:20:00Z',
                tags: ['engineering', 'first-year', 'fundamentals']
            },
            {
                id: 'group5',
                name: 'Advanced Programming',
                course: 'Computer Science',
                description: 'For students taking advanced programming courses. Focus on projects and code reviews.',
                meetingDay: 'Thursday',
                meetingTime: '5:00 PM',
                location: 'CS Lab 302',
                members: 7,
                organizer: 'Noor Ibrahim',
                organizerEmail: 'Noor.Ibrahim@stu.uob.edu.bh',
                createdAt: '2025-09-10T16:45:00Z',
                tags: ['programming', 'projects', 'code-review']
            },
            {
                id: 'group6',
                name: 'Linear Algebra Study',
                course: 'Mathematics',
                description: 'Understanding linear algebra concepts through group problem solving.',
                meetingDay: 'Monday',
                meetingTime: '10:00 AM',
                location: 'Math Building 101',
                members: 6,
                organizer: 'Omar Abdullah',
                organizerEmail: 'Omar.Abdullah@stu.uob.edu.bh',
                createdAt: '2025-09-08T08:30:00Z',
                tags: ['algebra', 'math', 'problem-solving']
            }
        ];
    }
    
    getFallbackComments(groupId) {
        const comments = {
            group1: [
                {
                    id: 'comment1',
                    author: 'Mohammed Abdullah',
                    text: 'Is this group still meeting during finals week?',
                    createdAt: '2025-10-10T14:25:00Z'
                },
                {
                    id: 'comment2',
                    author: 'Organizer: Sami Ali',
                    text: 'Yes! We\'ll have extended hours during finals week.',
                    createdAt: '2025-10-11T09:10:00Z'
                }
            ],
            group2: [
                {
                    id: 'comment3',
                    author: 'Sarah Mahmoud',
                    text: 'Will we be covering chapter 5 this week? I missed the last lecture.',
                    createdAt: '2025-10-05T18:30:00Z'
                }
            ],
            group3: [
                {
                    id: 'comment4',
                    author: 'Ahmed Khalid',
                    text: 'Can someone share the notes from last week? I was sick.',
                    createdAt: '2025-10-08T11:45:00Z'
                },
                {
                    id: 'comment5',
                    author: 'Layla Mohammed',
                    text: 'I\'ll email them to you, Ahmed.',
                    createdAt: '2025-10-08T12:20:00Z'
                }
            ]
        };
        
        return comments[groupId] || [];
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyGroupFinder();
});