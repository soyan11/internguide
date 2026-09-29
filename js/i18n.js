(function () {
    const translations = {
        en: {
            nav: {
                home: "Home",
                internships: "Internships",
                careerGuide: "Career Guide",
                cvInterview: "CV & Interview",
                about: "About",
                aboutContact: "About & Contact",
                login: "Log In",
                signup: "Sign Up",
                profile: "My Profile",
                logout: "Logout",
                backToSite: "Back to InternGuide"
            },
            common: {
                language: "Language",
                english: "English",
                khmer: "ខ្មែរ",
                profileSection: "My Account",
                search: "Search",
                filters: "Filters",
                searchInternships: "Search internships, companies, or skills...",
                applyNow: "Apply Now",
                viewDetails: "View Details",
                viewAll: "View All",
                activeHiring: "Active Hiring",
                posted: "Posted",
                recentlyPosted: "Recently posted",
                hideDetails: "Hide Details",
                previous: "Previous",
                next: "Next",
                page: "Page",
                of: "of",
                loading: "Loading...",
                noResults: "No internships found",
                clearFilters: "Clear Filters",
                clearAll: "Clear All",
                applyFilters: "Apply Filters",
                activeFilters: "Active filters",
                showing: "Showing",
                internshipOpportunities: "internship opportunities",
                noResultsHint: "Try removing a filter, changing your search, or clearing all filters.",
                noFilterOptions: "No filter options available.",
                loadingInternships: "Loading internships...",
                unableToLoadInternships: "Unable to load internships.",
                tryAgain: "Try Again",
                filterInternships: "Filter Internships",
                location: "Location",
                workMode: "Work Mode",
                internshipType: "Internship Type",
                duration: "Duration",
                careerField: "Career Field",
                skills: "Skills",
                description: "Description",
                requirements: "Requirements",
                deadline: "Deadline",
                cancel: "Cancel",
                close: "Close"
            },
            auth: {
                welcomeBack: "Welcome back",
                createAccount: "Create your account",
                continueWithGoogle: "Continue with Google",
                continueWithEmail: "or continue with email",
                signUpPhone: "or sign up with phone",
                continueWithPhone: "or continue with phone",
                signUpWithEmail: "or sign up with email",
                forgotPassword: "Forgot password?",
                password: "Password",
                email: "Email",
                phoneNumber: "Phone Number",
                continue: "Continue",
                studentPortal: "Student & Early Talent Portal",
                statusActive: "Platform Status: Active",
                welcomeBackTitle: "WELCOME BACK",
                loginSubtitle: "Log in to track applications, practice interviews, and discover opportunities prepared for students.",
                personalEmail: "University or Personal Email",
                login: "Log In",
                loginToInternGuide: "Log In to InternGuide",
                backToSite: "Back to InternGuide",
                getStarted: "GET STARTED",
                signupSubtitle: "Join InternGuide to discover internships, explore career paths, and build the skills you need for your future.",
                sendCode: "Send Verification Code",
                verificationCode: "Verification Code",
                enterCode: "Enter 6-digit code",
                useCambodia: "Use a Cambodia number, for example +855 12 345 678.",
                exploreSkills: "Explore career paths and skills",
                prepareCv: "Prepare your CV and interviews",
                keepSignedIn: "Keep me signed in",
                secureAccess: "🔒 Secure access",
                phoneLoginLabel: "Phone Number",
                verifyAndLogin: "Verify & Log In",
                resendCode: "Resend code",
                noAccount: "Don't have an account?",
                signUpFree: "Sign up for free",
                fullName: "Full Name",
                createAccountButton: "Create My InternGuide Account",
                alreadyHaveAccount: "Already have an account?",
                loginLink: "Log in",
                termsIntro: "I agree to the",
                and: "and",
                termsLink: "Terms of Service",
                privacyLink: "Privacy Policy",
                confirmPassword: "Confirm Password",
                passwordHint: "Use at least 8 characters.",
                forgotPasswordTitle: "Forgot your password?",
                forgotPasswordDescription: "Enter your email address and we'll send you a password reset link.",
                sendResetLink: "Send Reset Link",
                sendingResetLink: "Sending...",
                backToLogin: "Back to Login",
                checkYourEmail: "Check your email",
                resetEmailSent: "If an account exists for this email, a reset link has been sent. Please check your inbox.",
                resetPasswordTitle: "Reset Password",
                newPassword: "New Password",
                confirmNewPassword: "Confirm New Password",
                updatePassword: "Update Password",
                updatingPassword: "Updating...",
                passwordUpdated: "Password updated successfully.",
                passwordUpdatedDescription: "Your password has been changed. You can now log in with your new password.",
                emailRequired: "Please enter your email address.",
                emailInvalid: "Please enter a valid email address.",
                resetEmailError: "We couldn't send the reset email right now. Please try again.",
                passwordRequired: "Please enter a new password.",
                confirmPasswordRequired: "Please confirm your new password.",
                passwordTooShort: "Password must be at least 8 characters.",
                passwordsDoNotMatch: "Passwords do not match.",
                passwordUpdateError: "We couldn't update your password right now. Please try again.",
                invalidResetLink: "This password reset link is invalid or has expired. Please request a new password reset link.",
                requestNewResetLink: "Request New Reset Link",
                checkingResetLink: "Checking your reset link...",
                buildFuture: "Build your future, one opportunity at a time.",
                buildFutureText: "Find internships, explore career paths, and prepare for your next step with one student-friendly platform.",
                futureFeature1: "Discover internship opportunities",
                futureFeature2: "Explore career paths and skills",
                futureFeature3: "Prepare your CV and interviews",
                futureFeature4: "Start building your career with InternGuide.",
                futureFeature5: "Create your account and keep your internship search, career preparation, and future goals in one place.",
                ownPageHeading: "Profile",
                profileHeadingText: "Manage your student information, career interests, and CV.",
                editProfile: "Edit Profile"
            },
            profile: {
                headingText: "Manage your student information, career interests, and CV.",
                editProfile: "Edit Profile",
                personalInformation: "Personal Information",
                education: "Education",
                careerInterests: "Career Interests",
                skills: "Skills",
                languages: "Languages",
                aboutMe: "About Me",
                internshipExperience: "Internship Experience",
                fullName: "Full Name",
                email: "Email",
                phone: "Phone",
                location: "Location",
                university: "University",
                major: "Major",
                yearOfStudy: "Year of Study",
                expectedGraduation: "Expected Graduation",
                interestedRoles: "Interested Roles",
                preferredIndustry: "Preferred Industry",
                preferredLocation: "Preferred Location",
                internshipType: "Internship Type",
                notAdded: "Not added",
                notAvailable: "Not available",
                noSkills: "No skills added yet.",
                noLanguages: "No languages added yet.",
                noBio: "No bio added yet.",
                noExperience: "No internship experience added yet.",
                addExperience: "+ Add Experience",
                edit: "Edit"
            },
            home: {
                heroBadge: "YOUR CAREER START HERE",
                heroTitleLine1: "Find Your Dream",
                heroTitleLine2: "Internship Today",
                heroText: "Discover internship opportunities, get career guidance, and build the skills you need for a brighter future.",
                searchPlaceholder: "Search internships, companies, or skills...",
                search: "Search",
                featuredTitle: "Featured Internship Opportunities",
                featuredText: "Explore handpicked internships from top companies.",
                popularSearches: "Popular searches:",
                careerPathsTitle: "Explore Career Paths",
                careerPathsText: "Discover career options based on your interests.",
                noInternships: "No internships found",
                noInternshipsHint: "Try another keyword or choose a different category.",
                exploreCareer: "Explore career",
                popular: "Popular:"
            },
            testimonials: {
                title: "What Students Say",
                subtitle: "Student experiences with InternGuide.",
                viewAll: "View All Testimonials",
                eyebrow: "Student voices",
                pageTitle: "Student Testimonials",
                pageIntro: "Read approved experiences from students in the InternGuide community.",
                shareExperience: "Share Your Experience",
                reviewNotice: "Your testimonial will be reviewed before it can appear publicly.",
                signInPrompt: "Log in to share your experience.",
                name: "Name",
                role: "Role / Study",
                experience: "Your Experience",
                experiencePlaceholder: "Tell us about your experience with InternGuide...",
                rating: "Rating",
                ratingRequired: "Choose a rating to continue.",
                ratingOutOf: "Rated {rating} out of 5",
                star: "{rating} stars",
                submit: "Submit Testimonial",
                submitting: "Submitting...",
                submissionThanks: "Thank you for sharing your experience!",
                submissionPending: "Your testimonial has been submitted and is waiting for review.",
                submissionSuccess: "Thank you for sharing your experience! Your testimonial has been submitted and is waiting for review.",
                submissionError: "We could not submit your testimonial. Please try again.",
                approvedTitle: "Approved Testimonials",
                approvedSubtitle: "Stories shared by students and approved by our team.",
                noApproved: "No testimonials have been approved yet.",
                noPending: "No pending testimonials.",
                noTestimonials: "No testimonials found.",
                loading: "Loading testimonials...",
                unableToLoad: "Unable to load testimonials. Please try again.",
                tryAgain: "Try Again",
                backHome: "Back to InternGuide",
                adminTitle: "Testimonials",
                adminSubtitle: "Review and manage student testimonials.",
                total: "Total Testimonials",
                pending: "Pending",
                approved: "Approved",
                rejected: "Rejected",
                all: "All",
                searchPlaceholder: "Search name, role, or content...",
                columnAuthor: "Student",
                columnRole: "Role / Study",
                columnContent: "Experience",
                columnRating: "Rating",
                columnStatus: "Status",
                columnSubmitted: "Submitted",
                columnActions: "Actions",
                approve: "Approve",
                reject: "Reject",
                edit: "Edit",
                delete: "Delete",
                save: "Save Changes",
                cancel: "Cancel",
                editTitle: "Edit Testimonial",
                editSubtitle: "Update the testimonial details and review status.",
                confirmDelete: "Are you sure you want to delete this testimonial?",
                approveSuccess: "Testimonial approved.",
                rejectSuccess: "Testimonial rejected.",
                updateSuccess: "Testimonial updated.",
                deleteSuccess: "Testimonial deleted.",
                actionError: "Unable to update this testimonial. Please try again.",
                deleteError: "Unable to delete this testimonial. Please try again."
            },
            applications: {
                applyNow: "Apply Now",
                applied: "Applied",
                originalListing: "Original Listing",
                loginRequired: "Please log in to apply for this internship.",
                formTitle: "Application Form",
                formHint: "Review the internship details and submit your application.",
                internshipInfo: "Internship Information",
                internshipTitle: "Internship Title",
                company: "Company",
                location: "Location",
                workType: "Work Type",
                duration: "Duration",
                applicantInfo: "Applicant Information",
                fullName: "Full Name",
                email: "Email",
                phone: "Phone",
                university: "University",
                major: "Major",
                selectCv: "Select CV",
                chooseCv: "Choose a CV",
                cv: "CV",
                noCv: "You don't have a CV yet.",
                createCv: "Create CV",
                previewCv: "Preview selected CV",
                coverLetter: "Cover Letter",
                coverLetterPlaceholder: "Tell the employer why you're a good fit...",
                coverLetterRequired: "Write a cover letter before submitting.",
                submit: "Submit Application",
                submitting: "Submitting application...",
                loading: "Loading application information...",
                loadingCvs: "Loading CVs...",
                noCvRequired: "Add a CV to your profile before applying.",
                notAvailable: "Not provided",
                emailManagedAuth: "Managed in Auth",
                alreadyApplied: "You have already applied for this internship.",
                unableToLoad: "Unable to load application information. Please try again.",
                submitError: "Unable to submit your application. Please try again.",
                submittedTitle: "Application Submitted",
                submittedFor: "Your application for",
                submittedSuccessfully: "has been submitted successfully.",
                myApplications: "View My Applications",
                close: "Close",
                pageTitle: "My Applications",
                pageIntro: "Track your applications and review their current status.",
                loadingApplications: "Loading applications...",
                noApplications: "You haven't applied to any internships yet.",
                findInternships: "Find Internships",
                applicationDetails: "Application Details",
                appliedOn: "Applied",
                status: "Status",
                selectedCv: "Selected CV",
                viewDetails: "View Details",
                deleteApplication: "Delete",
                confirmDeleteApplication: "Remove this application from your list? This will not delete your saved CV.",
                removingApplication: "Removing application...",
                applicationRemoved: "Application removed.",
                deleteApplicationError: "Unable to remove this application. Please try again.",
                detailsError: "Unable to load application details. Please try again.",
                statusLabels: {
                    submitted: "Submitted",
                    reviewing: "Under Review",
                    shortlisted: "Shortlisted",
                    interview: "Interview",
                    accepted: "Accepted",
                    rejected: "Rejected",
                    withdrawn: "Withdrawn"
                },
                adminTitle: "Applications",
                adminIntro: "Review student applications and update their status.",
                adminSearchPlaceholder: "Search applicant, internship, or company...",
                allStatuses: "All Statuses",
                applicant: "Applicant",
                internship: "Internship",
                appliedDate: "Applied Date",
                cvColumn: "CV",
                action: "Action",
                viewApplication: "View",
                applicantDetails: "Applicant Details",
                internshipDetails: "Internship Details",
                currentStatus: "Current Status",
                updateStatus: "Update Status",
                saveStatus: "Save Status",
                statusUpdating: "Updating status...",
                statusUpdated: "Application status updated successfully.",
                statusUpdateError: "Unable to update application status. Please try again.",
                noAdminApplications: "No applications have been submitted yet.",
                noMatchingApplications: "No applications match this search or status.",
                cvUnavailable: "Selected CV information is unavailable.",
                cvPreviewUnavailable: "CV preview is unavailable."
            },
            admin: {
                panel: "Admin Panel",
                dashboard: "Dashboard",
                users: "Users",
                internships: "Internships",
                careerGuides: "Career Guides",
                search: "Search",
                status: "Status",
                actions: "Actions",
                add: "Add",
                edit: "Edit",
                delete: "Delete",
                save: "Save",
                cancel: "Cancel",
                logout: "Logout",
                allUsers: "All Users",
                students: "Students",
                admins: "Admins",
                applications: "Applications",
                careerResources: "Career Resources",
                analytics: "Analytics",
                settings: "Settings",
                notifications: "Notifications",
                reportsFeedback: "Reports & Feedback"
            }
        },
        km: {
            nav: {
                home: "ទំព័រដើម",
                internships: "កម្មសិក្សា",
                careerGuide: "មគ្គុទ្ទេសក៍អាជីព",
                cvInterview: "CV និងសម្ភាសន៍",
                about: "អំពីយើង",
                aboutContact: "អំពីយើង",
                login: "ចូលគណនី",
                signup: "បង្កើតគណនី",
                profile: "ប្រវត្តិរូបរបស់ខ្ញុំ",
                logout: "ចាកចេញ",
                backToSite: "ត្រឡប់ទៅ InternGuide"
            },
            common: {
                language: "ភាសា",
                english: "English",
                khmer: "ខ្មែរ",
                profileSection: "គណនីរបស់ខ្ញុំ",
                search: "ស្វែងរក",
                filters: "តម្រង",
                searchInternships: "ស្វែងរកកម្មសិក្សា ក្រុមហ៊ុន ឬជំនាញ...",
                applyNow: "ដាក់ពាក្យឥឡូវនេះ",
                viewDetails: "មើលព័ត៌មានលម្អិត",
                viewAll: "មើលទាំងអស់",
                activeHiring: "កំពុងជ្រើសរើស",
                posted: "បានបង្ហោះ",
                recentlyPosted: "ទើបបានបង្ហោះ",
                hideDetails: "លាក់ព័ត៌មានលម្អិត",
                previous: "ថយក្រោយ",
                next: "បន្ទាប់",
                page: "ទំព័រ",
                of: "ក្នុងចំណោម",
                loading: "កំពុងផ្ទុក...",
                noResults: "រកមិនឃើញកម្មសិក្សាទេ",
                clearFilters: "សម្អាតតម្រង",
                clearAll: "សម្អាតទាំងអស់",
                applyFilters: "អនុវត្តតម្រង",
                activeFilters: "តម្រងដែលបានជ្រើសរើស",
                showing: "បង្ហាញ",
                internshipOpportunities: "ឱកាសកម្មសិក្សា",
                noResultsHint: "សូមលុបតម្រង ប្តូរពាក្យស្វែងរក ឬសម្អាតតម្រងទាំងអស់។",
                noFilterOptions: "មិនមានជម្រើសតម្រងទេ។",
                loadingInternships: "កំពុងផ្ទុកកម្មសិក្សា...",
                unableToLoadInternships: "មិនអាចផ្ទុកកម្មសិក្សាបានទេ។",
                tryAgain: "ព្យាយាមម្តងទៀត",
                filterInternships: "ត្រងរកកម្មសិក្សា",
                location: "ទីតាំង",
                workMode: "របៀបធ្វើការ",
                internshipType: "ប្រភេទកម្មសិក្សា",
                duration: "រយៈពេល",
                careerField: "វិស័យអាជីព",
                skills: "ជំនាញ",
                description: "ពិពណ៌នា",
                requirements: "លក្ខខណ្ឌតម្រូវ",
                deadline: "ថ្ងៃផុតកំណត់",
                cancel: "បោះបង់",
                close: "បិទ"
            },
            auth: {
                welcomeBack: "ស្វាគមន៍មកវិញ",
                createAccount: "បង្កើតគណនីរបស់អ្នក",
                continueWithGoogle: "បន្តជាមួយ Google",
                continueWithEmail: "ឬបន្តជាមួយអ៊ីមែល",
                signUpPhone: "ឬចុះឈ្មោះដោយទូរស័ព្ទ",
                continueWithPhone: "ឬបន្តជាមួយទូរស័ព្ទ",
                signUpWithEmail: "ឬចុះឈ្មោះជាមួយអ៊ីមែល",
                forgotPassword: "ភ្លេចពាក្យសម្ងាត់?",
                password: "ពាក្យសម្ងាត់",
                email: "អ៊ីមែល",
                phoneNumber: "លេខទូរស័ព្ទ",
                continue: "បន្ត",
                studentPortal: "ស្វាគមន៍មកកាន់ InternGuide",
                statusActive: "ស្ថានភាពវេទិកា: សកម្ម",
                welcomeBackTitle: "ស្វាគមន៍មកវិញ",
                loginSubtitle: "ចូលគណនីដើម្បីតាមដានការដាក់ពាក្យ ហាត់សម្ភាសន៍ និងស្វែងរកឱកាសសម្រាប់សិស្ស។",
                personalEmail: "អ៊ីមែលសាកលវិទ្យាល័យ ឬអ៊ីមែលផ្ទាល់ខ្លួន",
                login: "ចូលគណនី",
                loginToInternGuide: "ចូលទៅកាន់ InternGuide",
                backToSite: "ត្រឡប់ទៅ InternGuide",
                getStarted: "ចាប់ផ្តើម",
                signupSubtitle: "ចូលរួម InternGuide ដើម្បីស្វែងរកកម្មសិក្សា រុករកផ្លូវអាជីព និងបង្កើតជំនាញដែលអ្នកត្រូវការ។",
                sendCode: "ផ្ញើលេខសម្ងាត់បញ្ជាក់",
                verificationCode: "លេខកូដបញ្ជាក់",
                enterCode: "បញ្ចូលលេខ 6 ខ្ទង់",
                useCambodia: "ប្រើលេខទូរស័ព្ទកម្ពុជា ឧទាហរណ៍ +855 12 345 678.",
                exploreSkills: "រុករកផ្លូវអាជីព និងជំនាញ",
                prepareCv: "រៀបចំ CV និងសម្ភាសន៍របស់អ្នក",
                keepSignedIn: "កុំចាកចេញ",
                secureAccess: "🔒 ការបំពេញលក្ខខណ្ឌសុវត្ថិភាព",
                phoneLoginLabel: "លេខទូរស័ព្ទ",
                verifyAndLogin: "ផ្ទៀងផ្ទាត់ និងចូល",
                resendCode: "ផ្ញើកូដឡើងវិញ",
                noAccount: "មិនមានគណនីទេ?",
                signUpFree: "ចុះឈ្មោះដោយឥតគិតថ្លៃ",
                fullName: "ឈ្មោះពេញ",
                createAccountButton: "បង្កើតគណនី InternGuide របស់ខ្ញុំ",
                alreadyHaveAccount: "មានគណនីរួចហើយ?",
                loginLink: "ចូលគណនី",
                termsIntro: "ខ្ញុំយល់ព្រមជាមួយ",
                and: "និង",
                termsLink: "ល័ក្ខខណ្ឌសេវាកម្ម",
                privacyLink: "គោលការណ៍ឯកជន",
                confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
                passwordHint: "ប្រើយ៉ាងហោចណាស់ 8 តួរ.",
                forgotPasswordTitle: "ភ្លេចពាក្យសម្ងាត់មែនទេ?",
                forgotPasswordDescription: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក ហើយយើងនឹងផ្ញើតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ។",
                sendResetLink: "ផ្ញើតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញ",
                sendingResetLink: "កំពុងផ្ញើ...",
                backToLogin: "ត្រឡប់ទៅចូលគណនី",
                checkYourEmail: "សូមពិនិត្យអ៊ីមែលរបស់អ្នក",
                resetEmailSent: "ប្រសិនបើមានគណនីភ្ជាប់នឹងអ៊ីមែលនេះ តំណកំណត់ពាក្យសម្ងាត់ឡើងវិញនឹងត្រូវបានផ្ញើ។ សូមពិនិត្យប្រអប់សំបុត្ររបស់អ្នក។",
                resetPasswordTitle: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",
                newPassword: "ពាក្យសម្ងាត់ថ្មី",
                confirmNewPassword: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
                updatePassword: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",
                updatingPassword: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
                passwordUpdated: "បានធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ដោយជោគជ័យ។",
                passwordUpdatedDescription: "ពាក្យសម្ងាត់របស់អ្នកត្រូវបានប្តូរហើយ។ ឥឡូវអ្នកអាចចូលដោយប្រើពាក្យសម្ងាត់ថ្មីបាន។",
                emailRequired: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។",
                emailInvalid: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។",
                resetEmailError: "យើងមិនអាចផ្ញើអ៊ីមែលកំណត់ឡើងវិញនៅពេលនេះបានទេ។ សូមព្យាយាមម្តងទៀត។",
                passwordRequired: "សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី។",
                confirmPasswordRequired: "សូមបញ្ជាក់ពាក្យសម្ងាត់ថ្មីរបស់អ្នក។",
                passwordTooShort: "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ។",
                passwordsDoNotMatch: "ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។",
                passwordUpdateError: "យើងមិនអាចធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ឥឡូវនេះបានទេ។ សូមព្យាយាមម្តងទៀត។",
                invalidResetLink: "តំណកំណត់ពាក្យសម្ងាត់នេះមិនត្រឹមត្រូវ ឬផុតកំណត់ហើយ។ សូមស្នើសុំតំណកំណត់ថ្មី។",
                requestNewResetLink: "ស្នើសុំតំណកំណត់ថ្មី",
                checkingResetLink: "កំពុងផ្ទៀងផ្ទាត់តំណកំណត់...",
                buildFuture: "ស្ថាបនាអនាគតរបស់អ្នក ដោយឱកាសនីមួយៗ។",
                buildFutureText: "ស្វែងរកកម្មសិក្សា រុករកផ្លូវអាជីព និងរៀបចំជំហានបន្ទាប់របស់អ្នក ជាមួយវេទិកាដែលងាយស្រួលសម្រាប់សិស្ស។",
                futureFeature1: "ស្វែងរកឱកាសកម្មសិក្សា",
                futureFeature2: "រុករកផ្លូវអាជីព និងជំនាញ",
                futureFeature3: "រៀបចំ CV និងសម្ភាសន៍របស់អ្នក",
                futureFeature4: "ចាប់ផ្តើមស្ថាបនាអាជីពជាមួយ InternGuide។",
                futureFeature5: "បង្កើតគណនីរបស់អ្នក និងរក្សាទុកការស្វែងរកកម្មសិក្សា ការរៀបចំអាជីព និងគោលដៅនាពេលអនាគតនៅក្នុងកន្លែងតែមួយ។",
                ownPageHeading: "ប្រវត្តិរូប",
                profileHeadingText: "គ្រប់គ្រងព័ត៌មានសិស្ស ចំណង់ចំណូលចិត្តអាជីព និង CV របស់អ្នក។",
                editProfile: "កែប្រែប្រវត្តិរូប"
            },
            profile: {
                headingText: "គ្រប់គ្រងព័ត៌មានសិស្ស ចំណង់ចំណូលចិត្តអាជីព និង CV របស់អ្នក។",
                editProfile: "កែប្រែប្រវត្តិរូប",
                personalInformation: "ព័ត៌មានផ្ទាល់ខ្លួន",
                education: "ការអប់រំ",
                careerInterests: "ចំណង់ចំណូលចិត្តអាជីព",
                skills: "ជំនាញ",
                languages: "ភាសា",
                aboutMe: "អំពីខ្ញុំ",
                internshipExperience: "បទពិសោធន៍កម្មសិក្សា",
                fullName: "ឈ្មោះពេញ",
                email: "អ៊ីមែល",
                phone: "លេខទូរស័ព្ទ",
                location: "ទីតាំង",
                university: "សាកលវិទ្យាល័យ",
                major: "មុខជំនាញ",
                yearOfStudy: "ឆ្នាំសិក្សា",
                expectedGraduation: "ការបញ្ចប់ការសិក្សា",
                interestedRoles: "តួនាទីដែលចាប់អារម្មណ៍",
                preferredIndustry: "ឧស្សាហកម្មដែលចូលចិត្ត",
                preferredLocation: "ទីតាំងដែលចូលចិត្ត",
                internshipType: "ប្រភេទកម្មសិក្សា",
                notAdded: "មិនបានបន្ថែម",
                notAvailable: "មិនមាន",
                noSkills: "មិនទាន់មានជំនាញ។",
                noLanguages: "មិនទាន់មានភាសា។",
                noBio: "មិនទាន់មានអំពីខ្ញុំ។",
                noExperience: "មិនទាន់មានបទពិសោធន៍កម្មសិក្សា។",
                addExperience: "+ បន្ថែមបទពិសោធន៍",
                edit: "កែប្រែ"
            },
            home: {
                heroBadge: "ចាប់ផ្តើមអាជីពរបស់អ្នកនៅទីនេះ",
                heroTitleLine1: "ស្វែងរកអ្វីដែលអ្នកចូលចិត្ត",
                heroTitleLine2: "កម្មសិក្សាពេលនេះ",
                heroText: "រកឃើញឱកាសកម្មសិក្សា ទទួលបានការណែនាំអាជីព និងបង្កើតជំនាញដែលអ្នកត្រូវការ សម្រាប់អនាគតដ៏ភ្លឺស្វាង។",
                searchPlaceholder: "ស្វែងរកកម្មសិក្សា ឈ្មោះក្រុមហ៊ុន ឬជំនាញ...",
                search: "ស្វែងរក",
                featuredTitle: "ឱកាសកម្មសិក្សាដែលគេជ្រើសរើស",
                featuredText: "រុករកកម្មសិក្សាដែលក្រុមហ៊ុនលំដាប់លំដោយបានជ្រើសរើស។",
                popularSearches: "ស្វែងរកពេញនិយម:",
                careerPathsTitle: "រុករកផ្លូវអាជីព",
                careerPathsText: "ស្វែងរកជម្រើសអាជីពដោយផ្អែកលើចំណង់ចំណូលចិត្តរបស់អ្នក។",
                noInternships: "រកមិនឃើញកម្មសិក្សាទេ",
                noInternshipsHint: "សាកល្បងពាក្យគន្លឹះមួយទៀត ឬជ្រើសរើសប្រភេទផ្សេង។",
                exploreCareer: "រុករកអាជីព",
                popular: "ពេញនិយម:"
            },
            testimonials: {
                title: "មតិរបស់សិស្ស",
                subtitle: "បទពិសោធន៍របស់សិស្សជាមួយ InternGuide។",
                viewAll: "មើលមតិទាំងអស់",
                eyebrow: "សំឡេងរបស់សិស្ស",
                pageTitle: "មតិរបស់សិស្ស",
                pageIntro: "អានបទពិសោធន៍ដែលបានអនុម័តពីសិស្សក្នុងសហគមន៍ InternGuide។",
                shareExperience: "ចែករំលែកបទពិសោធន៍របស់អ្នក",
                reviewNotice: "មតិរបស់អ្នកនឹងត្រូវបានពិនិត្យមុនពេលបង្ហាញជាសាធារណៈ។",
                signInPrompt: "ចូលគណនីដើម្បីចែករំលែកបទពិសោធន៍របស់អ្នក។",
                name: "ឈ្មោះ",
                role: "តួនាទី / ការសិក្សា",
                experience: "បទពិសោធន៍របស់អ្នក",
                experiencePlaceholder: "ប្រាប់យើងអំពីបទពិសោធន៍របស់អ្នកជាមួយ InternGuide...",
                rating: "ការវាយតម្លៃ",
                ratingRequired: "សូមជ្រើសរើសការវាយតម្លៃ។",
                ratingOutOf: "បានវាយតម្លៃ {rating} ក្នុងចំណោម 5",
                star: "{rating} ផ្កាយ",
                submit: "ដាក់ស្នើមតិ",
                submitting: "កំពុងដាក់ស្នើ...",
                submissionThanks: "សូមអរគុណដែលបានចែករំលែកបទពិសោធន៍របស់អ្នក!",
                submissionPending: "មតិរបស់អ្នកត្រូវបានដាក់ស្នើ ហើយកំពុងរង់ចាំការពិនិត្យ។",
                submissionSuccess: "សូមអរគុណដែលបានចែករំលែកបទពិសោធន៍របស់អ្នក! មតិរបស់អ្នកត្រូវបានដាក់ស្នើ ហើយកំពុងរង់ចាំការពិនិត្យ។",
                submissionError: "មិនអាចដាក់ស្នើមតិបានទេ។ សូមព្យាយាមម្តងទៀត។",
                approvedTitle: "មតិដែលបានអនុម័ត",
                approvedSubtitle: "បទពិសោធន៍ដែលសិស្សបានចែករំលែក និងក្រុមការងារបានអនុម័ត។",
                noApproved: "មិនទាន់មានមតិដែលបានអនុម័តទេ។",
                noPending: "មិនមានមតិដែលកំពុងរង់ចាំទេ។",
                noTestimonials: "រកមិនឃើញមតិទេ។",
                loading: "កំពុងផ្ទុកមតិ...",
                unableToLoad: "មិនអាចផ្ទុកមតិបានទេ។ សូមព្យាយាមម្តងទៀត។",
                tryAgain: "ព្យាយាមម្តងទៀត",
                backHome: "ត្រឡប់ទៅ InternGuide",
                adminTitle: "ការគ្រប់គ្រងមតិ",
                adminSubtitle: "ពិនិត្យ និងគ្រប់គ្រងមតិរបស់សិស្ស។",
                total: "មតិសរុប",
                pending: "កំពុងរង់ចាំ",
                approved: "បានអនុម័ត",
                rejected: "បានបដិសេធ",
                all: "ទាំងអស់",
                searchPlaceholder: "ស្វែងរកឈ្មោះ តួនាទី ឬខ្លឹមសារ...",
                columnAuthor: "សិស្ស",
                columnRole: "តួនាទី / ការសិក្សា",
                columnContent: "បទពិសោធន៍",
                columnRating: "ការវាយតម្លៃ",
                columnStatus: "ស្ថានភាព",
                columnSubmitted: "កាលបរិច្ឆេទដាក់ស្នើ",
                columnActions: "សកម្មភាព",
                approve: "អនុម័ត",
                reject: "បដិសេធ",
                edit: "កែសម្រួល",
                delete: "លុប",
                save: "រក្សាទុកការផ្លាស់ប្តូរ",
                cancel: "បោះបង់",
                editTitle: "កែសម្រួលមតិ",
                editSubtitle: "ធ្វើបច្ចុប្បន្នភាពព័ត៌មាន និងស្ថានភាពមតិ។",
                confirmDelete: "តើអ្នកប្រាកដថាចង់លុបមតិនេះឬទេ?",
                approveSuccess: "បានអនុម័តមតិ។",
                rejectSuccess: "បានបដិសេធមតិ។",
                updateSuccess: "បានធ្វើបច្ចុប្បន្នភាពមតិ។",
                deleteSuccess: "បានលុបមតិ។",
                actionError: "មិនអាចធ្វើបច្ចុប្បន្នភាពមតិនេះបានទេ។ សូមព្យាយាមម្តងទៀត។",
                deleteError: "មិនអាចលុបមតិនេះបានទេ។ សូមព្យាយាមម្តងទៀត។"
            },
            applications: {
                applyNow: "ដាក់ពាក្យឥឡូវនេះ",
                applied: "បានដាក់ពាក្យ",
                originalListing: "ប្រកាសដើម",
                loginRequired: "សូមចូលគណនីដើម្បីដាក់ពាក្យកម្មសិក្សានេះ។",
                formTitle: "ទម្រង់ដាក់ពាក្យ",
                formHint: "ពិនិត្យព័ត៌មានកម្មសិក្សា ហើយដាក់ពាក្យរបស់អ្នក។",
                internshipInfo: "ព័ត៌មានកម្មសិក្សា",
                internshipTitle: "ចំណងជើងកម្មសិក្សា",
                company: "ក្រុមហ៊ុន",
                location: "ទីតាំង",
                workType: "របៀបធ្វើការ",
                duration: "រយៈពេល",
                applicantInfo: "ព័ត៌មានអ្នកដាក់ពាក្យ",
                fullName: "ឈ្មោះពេញ",
                email: "អ៊ីមែល",
                phone: "ទូរស័ព្ទ",
                university: "សាកលវិទ្យាល័យ",
                major: "មុខជំនាញ",
                selectCv: "ជ្រើសរើស CV",
                chooseCv: "ជ្រើសរើស CV មួយ",
                cv: "CV",
                noCv: "អ្នកមិនទាន់មាន CV ទេ។",
                createCv: "បង្កើត CV",
                previewCv: "មើល CV ដែលបានជ្រើសរើស",
                coverLetter: "លិខិតណែនាំខ្លួន",
                coverLetterPlaceholder: "ប្រាប់និយោជកថាហេតុអ្វីអ្នកស័ក្តិសម...",
                coverLetterRequired: "សូមសរសេរលិខិតណែនាំខ្លួនមុនពេលដាក់ស្នើ។",
                submit: "ដាក់ពាក្យស្នើសុំ",
                submitting: "កំពុងដាក់ពាក្យ...",
                loading: "កំពុងផ្ទុកព័ត៌មានពាក្យស្នើសុំ...",
                loadingCvs: "កំពុងផ្ទុក CV...",
                noCvRequired: "សូមបន្ថែម CV ទៅក្នុងប្រវត្តិរូបរបស់អ្នកមុនពេលដាក់ពាក្យ។",
                notAvailable: "មិនបានផ្តល់ជូន",
                emailManagedAuth: "គ្រប់គ្រងក្នុង Auth",
                alreadyApplied: "អ្នកបានដាក់ពាក្យកម្មសិក្សានេះរួចហើយ។",
                unableToLoad: "មិនអាចផ្ទុកព័ត៌មានពាក្យស្នើសុំបានទេ។ សូមព្យាយាមម្តងទៀត។",
                submitError: "មិនអាចដាក់ពាក្យបានទេ។ សូមព្យាយាមម្តងទៀត។",
                submittedTitle: "បានដាក់ពាក្យរួចរាល់",
                submittedFor: "ពាក្យស្នើសុំរបស់អ្នកសម្រាប់",
                submittedSuccessfully: "ត្រូវបានដាក់ស្នើដោយជោគជ័យ។",
                myApplications: "មើលពាក្យស្នើសុំរបស់ខ្ញុំ",
                close: "បិទ",
                pageTitle: "ពាក្យស្នើសុំរបស់ខ្ញុំ",
                pageIntro: "តាមដានពាក្យស្នើសុំ និងពិនិត្យស្ថានភាពបច្ចុប្បន្ន។",
                loadingApplications: "កំពុងផ្ទុកពាក្យស្នើសុំ...",
                noApplications: "អ្នកមិនទាន់បានដាក់ពាក្យកម្មសិក្សាទេ។",
                findInternships: "ស្វែងរកកម្មសិក្សា",
                applicationDetails: "ព័ត៌មានពាក្យស្នើសុំ",
                appliedOn: "បានដាក់ពាក្យនៅ",
                status: "ស្ថានភាព",
                selectedCv: "CV ដែលបានជ្រើសរើស",
                viewDetails: "មើលព័ត៌មានលម្អិត",
                deleteApplication: "លុប",
                confirmDeleteApplication: "តើអ្នកចង់លុបពាក្យស្នើសុំនេះពីបញ្ជីរបស់អ្នកឬ? CV ដែលបានរក្សាទុករបស់អ្នកនឹងមិនត្រូវបានលុបទេ។",
                removingApplication: "កំពុងលុបពាក្យស្នើសុំ...",
                applicationRemoved: "បានលុបពាក្យស្នើសុំ។",
                deleteApplicationError: "មិនអាចលុបពាក្យស្នើសុំនេះបានទេ។ សូមព្យាយាមម្តងទៀត។",
                detailsError: "មិនអាចផ្ទុកព័ត៌មានពាក្យស្នើសុំបានទេ។ សូមព្យាយាមម្តងទៀត។",
                statusLabels: {
                    submitted: "បានដាក់ស្នើ",
                    reviewing: "កំពុងពិនិត្យ",
                    shortlisted: "បានជាប់បញ្ជីសម្រាំង",
                    interview: "សម្ភាសន៍",
                    accepted: "បានទទួល",
                    rejected: "បានបដិសេធ",
                    withdrawn: "បានដកពាក្យ"
                },
                adminTitle: "ពាក្យស្នើសុំ",
                adminIntro: "ពិនិត្យពាក្យស្នើសុំរបស់សិស្ស និងធ្វើបច្ចុប្បន្នភាពស្ថានភាព។",
                adminSearchPlaceholder: "ស្វែងរកអ្នកដាក់ពាក្យ កម្មសិក្សា ឬក្រុមហ៊ុន...",
                allStatuses: "ស្ថានភាពទាំងអស់",
                applicant: "អ្នកដាក់ពាក្យ",
                internship: "កម្មសិក្សា",
                appliedDate: "កាលបរិច្ឆេទដាក់ពាក្យ",
                cvColumn: "CV",
                action: "សកម្មភាព",
                viewApplication: "មើល",
                applicantDetails: "ព័ត៌មានអ្នកដាក់ពាក្យ",
                internshipDetails: "ព័ត៌មានកម្មសិក្សា",
                currentStatus: "ស្ថានភាពបច្ចុប្បន្ន",
                updateStatus: "ធ្វើបច្ចុប្បន្នភាពស្ថានភាព",
                saveStatus: "រក្សាទុកស្ថានភាព",
                statusUpdating: "កំពុងធ្វើបច្ចុប្បន្នភាពស្ថានភាព...",
                statusUpdated: "បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពពាក្យស្នើសុំដោយជោគជ័យ។",
                statusUpdateError: "មិនអាចធ្វើបច្ចុប្បន្នភាពស្ថានភាពបានទេ។ សូមព្យាយាមម្តងទៀត។",
                noAdminApplications: "មិនទាន់មានការដាក់ពាក្យទេ។",
                noMatchingApplications: "មិនមានពាក្យស្នើសុំដែលត្រូវនឹងការស្វែងរក ឬស្ថានភាពនេះទេ។",
                cvUnavailable: "មិនមានព័ត៌មាន CV ដែលបានជ្រើសរើសទេ។",
                cvPreviewUnavailable: "មិនអាចមើល CV ជាមុនបានទេ។"
            },
            admin: {
                panel: "បន្ទះគ្រប់គ្រង",
                dashboard: "ផ្ទាំងគ្រប់គ្រង",
                users: "អ្នកប្រើប្រាស់",
                internships: "កម្មសិក្សា",
                careerGuides: "មគ្គុទ្ទេសក៍អាជីព",
                search: "ស្វែងរក",
                status: "ស្ថានភាព",
                actions: "សកម្មភាព",
                add: "បន្ថែម",
                edit: "កែសម្រួល",
                delete: "លុប",
                save: "រក្សាទុក",
                cancel: "បោះបង់",
                logout: "ចាកចេញ",
                allUsers: "អ្នកប្រើប្រាស់ទាំងអស់",
                students: "សិស្ស",
                admins: "អ្នកគ្រប់គ្រង",
                applications: "ពាក្យសុំ",
                careerResources: "ធនធានអាជីព",
                analytics: "ការវិភាគ",
                settings: "ការកំណត់",
                notifications: "ការជូនដំណឹង",
                reportsFeedback: "របាយការណ៍ និងមតិកែលម្អ"
            }
        }
    };

    const textTranslations = {
        "Home": "ទំព័រដើម",
        "Internships": "កម្មសិក្សា",
        "Internship": "កម្មសិក្សា",
        "Career Guide": "មគ្គុទ្ទេសក៍អាជីព",
        "CV & Interview": "CV និងសម្ភាសន៍",
        "About": "អំពីយើង",
        "About & Contact": "អំពីយើង និងទំនាក់ទំនង",
        "Log In": "ចូលគណនី",
        "Login": "ចូលគណនី",
        "Sign Up": "បង្កើតគណនី",
        "My Profile": "ប្រវត្តិរូបរបស់ខ្ញុំ",
        "Logout": "ចាកចេញ",
        "Register or Login": "ចុះឈ្មោះ ឬចូលគណនី",
        "Search": "ស្វែងរក",
        "View All": "មើលទាំងអស់",
        "Apply Now": "ដាក់ពាក្យឥឡូវនេះ",
        "Apply now": "ដាក់ពាក្យឥឡូវនេះ",
        "View Details": "មើលព័ត៌មានលម្អិត",
        "Read Guide": "អានមគ្គុទ្ទេសក៍",
        "Contact Us": "ទាក់ទងយើង",
        "Explore Internships": "ស្វែងរកកម្មសិក្សា",
        "Explore Career Guide": "ស្វែងរកមគ្គុទ្ទេសក៍អាជីព",
        "Explore career": "ស្វែងរកអាជីព",
        "Learn To Create CV": "រៀនបង្កើត CV",
        "Filter Internships": "ត្រងរកកម្មសិក្សា",
        "Clear Filters": "សម្អាតតម្រង",
        "Popular searches:": "ការស្វែងរកពេញនិយម៖",
        "Popular:": "ពេញនិយម៖",
        "Location": "ទីតាំង",
        "Work Mode": "របៀបធ្វើការ",
        "Internship Type": "ប្រភេទកម្មសិក្សា",
        "Duration": "រយៈពេល",
        "Category": "ប្រភេទ",
        "Skills": "ជំនាញ",
        "No filters available.": "មិនមានតម្រងទេ។",
        "No internships found": "រកមិនឃើញកម្មសិក្សាទេ",
        "No internships match these search terms and filters.": "មិនមានកម្មសិក្សាដែលត្រូវនឹងពាក្យស្វែងរក និងតម្រងទាំងនេះទេ។",
        "Loading internships...": "កំពុងផ្ទុកកម្មសិក្សា...",
        "Applications open": "កំពុងទទួលពាក្យ",
        "Deadline": "ថ្ងៃផុតកំណត់",
        "Company": "ក្រុមហ៊ុន",
        "Open": "បើក",
        "Career Preparation": "ការត្រៀមខ្លួនសម្រាប់អាជីព",
        "Explore Your Future": "ស្វែងរកអនាគតរបស់អ្នក",
        "Find the Right": "ស្វែងរក",
        "for You": "ដែលសមស្របសម្រាប់អ្នក",
        "Not Sure Which Internship Is Right for You?": "មិនប្រាកដថាកម្មសិក្សាមួយណាសមស្របសម្រាប់អ្នកមែនទេ?",
        "Explore our Work with an engineering team to build and improve web applications while gaining practical software development experience": "ស្វែងយល់ពីការធ្វើការជាមួយក្រុមវិស្វកម្ម ដើម្បីបង្កើត និងកែលម្អកម្មវិធីគេហទំព័រ ព្រមទាំងទទួលបានបទពិសោធន៍អភិវឌ្ឍកម្មវិធីជាក់ស្តែង។",
        "Discover the Right Career": "ស្វែងរកអាជីពដែលសមស្រប",
        "Path for You": "សម្រាប់អ្នក",
        "Explore different careers, understand the skills you need, and discover opportunities that match your interests and goals.": "ស្វែងយល់ពីអាជីពផ្សេងៗ យល់ដឹងអំពីជំនាញដែលអ្នកត្រូវការ និងរកឱកាសដែលត្រូវនឹងចំណង់ចំណូលចិត្ត និងគោលដៅរបស់អ្នក។",
        "Prepare for Interview": "ត្រៀមខ្លួនសម្រាប់សម្ភាសន៍",
        "Create Your CV": "បង្កើត CV របស់អ្នក",
        "Build a CV. Prepare for Interviews. Get Ready for Your": "បង្កើត CV ត្រៀមសម្ភាសន៍ និងត្រៀមខ្លួនសម្រាប់",
        "Future": "អនាគត",
        "Learn how to create a professional CV, describe your skills, and prepare confidently for internship interviews.": "រៀនបង្កើត CV ប្រកបដោយវិជ្ជាជីវៈ ពិពណ៌នាជំនាញរបស់អ្នក និងត្រៀមខ្លួនដោយទំនុកចិត្តសម្រាប់សម្ភាសន៍កម្មសិក្សា។",
        "ATS Pass Rate": "អត្រាឆ្លងកាត់ ATS",
        "Interviews Aced": "សម្ភាសន៍ដែលបានជោគជ័យ",
        "Verified Templates": "គំរូដែលបានផ្ទៀងផ្ទាត់",
        "About InternGuide": "អំពី InternGuide",
        "Helping Students Find Opportunities and Build Their": "ជួយសិស្សស្វែងរកឱកាស និងកសាង",
        "InternGuide brings internship opportunities, career guidance, skills information, and application preparation together in one simple, empowering platform built specifically for students.": "InternGuide ប្រមូលផ្តុំឱកាសកម្មសិក្សា ការណែនាំអាជីព ព័ត៌មានជំនាញ និងការត្រៀមដាក់ពាក្យនៅលើវេទិកាតែមួយ ដែលបង្កើតឡើងជាពិសេសសម្រាប់សិស្ស។",
        "Student Members": "សមាជិកជានិស្សិត",
        "Verified Positions": "មុខតំណែងដែលបានផ្ទៀងផ្ទាត់",
        "Interview Confidence": "ទំនុកចិត្តក្នុងការសម្ភាសន៍",
        "Verified Guidance": "ការណែនាំដែលបានផ្ទៀងផ្ទាត់",
        "Direct recruiter vetted": "បានពិនិត្យដោយអ្នកជ្រើសរើសបុគ្គលិក",
        "Empowering Students": "ផ្តល់អំណាចដល់សិស្ស",
        "Seamless transition to work": "ការផ្លាស់ប្តូរទៅកាន់ការងារយ៉ាងរលូន",
        "Purpose & Value": "គោលបំណង និងតម្លៃ",
        "Why InternGuide?": "ហេតុអ្វី InternGuide?",
        "Profile completion": "ការបំពេញប្រវត្តិរូប",
        "No skills added yet.": "មិនទាន់មានជំនាញទេ។",
        "No languages added yet.": "មិនទាន់មានភាសាទេ។",
        "No bio added yet.": "មិនទាន់មានប្រវត្តិរូបសង្ខេបទេ។",
        "No internship experience added yet.": "មិនទាន់មានបទពិសោធន៍កម្មសិក្សាទេ។",
        "The database connection is not available. Please refresh the page.": "មិនមានការតភ្ជាប់មូលដ្ឋានទិន្នន័យទេ។ សូមផ្ទុកទំព័រឡើងវិញ។",
        "Internships could not be loaded. Please try again later.": "មិនអាចផ្ទុកកម្មសិក្សាបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
        "Admin Panel": "ផ្ទាំងគ្រប់គ្រង",
        "Dashboard": "ផ្ទាំងគ្រប់គ្រង",
        "Users": "អ្នកប្រើប្រាស់",
        "All Users": "អ្នកប្រើប្រាស់ទាំងអស់",
        "Students": "សិស្ស",
        "Admins": "អ្នកគ្រប់គ្រង",
        "Applications": "ពាក្យសុំ",
        "Companies": "ក្រុមហ៊ុន",
        "Career Resources": "ធនធានអាជីព",
        "Career Guides": "មគ្គុទ្ទេសក៍អាជីព",
        "Analytics": "ការវិភាគ",
        "Notifications": "ការជូនដំណឹង",
        "Reports & Feedback": "របាយការណ៍ និងមតិកែលម្អ",
        "Settings": "ការកំណត់",
        "Back to Website": "ត្រឡប់ទៅគេហទំព័រ",
        "Search anything...": "ស្វែងរកអ្វីក៏បាន...",
        "Total Users": "អ្នកប្រើប្រាស់សរុប",
        "Active Internships": "កម្មសិក្សាសកម្ម",
        "Total Internships": "កម្មសិក្សាសរុប",
        "Internship Activity": "សកម្មភាពកម្មសិក្សា",
        "Internship Status": "ស្ថានភាពកម្មសិក្សា",
        "Recent Internship Listings": "កម្មសិក្សាដែលបានប្រកាសថ្មីៗ",
        "System Data Status": "ស្ថានភាពទិន្នន័យប្រព័ន្ធ",
        "Manage Internships": "គ្រប់គ្រងកម្មសិក្សា",
        "Manage Users": "គ្រប់គ្រងអ្នកប្រើប្រាស់",
        "Add Internship": "បន្ថែមកម្មសិក្សា",
        "Create Article": "បង្កើតអត្ថបទ",
        "View Reports": "មើលរបាយការណ៍",
        "Position": "មុខតំណែង",
        "Posted Date": "កាលបរិច្ឆេទប្រកាស",
        "Status": "ស្ថានភាព",
        "Action": "សកម្មភាព",
        "Connected": "បានភ្ជាប់",
        "Unavailable": "មិនអាចប្រើបាន",
        "Loading...": "កំពុងផ្ទុក...",
        "Save": "រក្សាទុក",
        "Cancel": "បោះបង់",
        "Edit": "កែប្រែ",
        "Delete": "លុប",
        "Add": "បន្ថែម",
        "Name": "ឈ្មោះ",
        "Email": "អ៊ីមែល",
        "Phone": "ទូរស័ព្ទ",
        "Search internships, companies, or skills...": "ស្វែងរកកម្មសិក្សា ក្រុមហ៊ុន ឬជំនាញ...",
        "Search careers, skills, or industries...": "ស្វែងរកអាជីព ជំនាញ ឬឧស្សាហកម្ម...",
        "Location (e.g. Kuala Lumpur, R...": "ទីតាំង (ឧ. ភ្នំពេញ...) ",
        "Internships | InternGuide": "កម្មសិក្សា | InternGuide",
        "Career Guide | InternGuide": "មគ្គុទ្ទេសក៍អាជីព | InternGuide",
        "CV-Interview | InternGuide": "CV និងសម្ភាសន៍ | InternGuide",
        "About & Contact | InternGuide": "អំពីយើង និងទំនាក់ទំនង | InternGuide",
        "Create CV | InternGuide": "បង្កើត CV | InternGuide",
        "InternGuide brings internship opportunities, career guidance, skills information, and application preparation together in one simple, empowering platform built specifically for students.": "InternGuide ប្រមូលផ្តុំឱកាសកម្មសិក្សា ការណែនាំអាជីព ព័ត៌មានជំនាញ និងការត្រៀមដាក់ពាក្យនៅលើវេទិកាតែមួយ ដែលបង្កើតឡើងជាពិសេសសម្រាប់សិស្ស។",
        "Starting an internship search or choosing a career path can be challenging when key insights, deadlines, and skill expectations are scattered across disjointed sites.": "ការស្វែងរកកម្មសិក្សា ឬជ្រើសរើសផ្លូវអាជីពអាចពិបាក នៅពេលព័ត៌មានសំខាន់ៗ កាលកំណត់ និងជំនាញដែលត្រូវការត្រូវបានបែកខ្ញែកនៅលើគេហទំព័រផ្សេងៗ។",
        "Find Your Dream": "ស្វែងរកក្តីស្រមៃរបស់អ្នក",
        "Internship Today": "កម្មសិក្សាថ្ងៃនេះ",
        "Discover internship opportunities, get career guidance, and build the skills you need for a brighter future.": "ស្វែងរកឱកាសកម្មសិក្សា ទទួលការណែនាំអាជីព និងអភិវឌ្ឍជំនាញដែលអ្នកត្រូវការសម្រាប់អនាគតដ៏ភ្លឺស្វាង។",
        "Featured Internship Opportunities": "ឱកាសកម្មសិក្សាពិសេស",
        "Explore handpicked internships from top companies.": "ស្វែងរកកម្មសិក្សាដែលបានជ្រើសរើសពីក្រុមហ៊ុនឈានមុខ។",
        "Explore Career Paths": "ស្វែងយល់ពីផ្លូវអាជីព",
        "Discover career options based on your interests.": "ស្វែងរកជម្រើសអាជីពដោយផ្អែកលើចំណាប់អារម្មណ៍របស់អ្នក។",
        "Career Preparation Resources": "ធនធានត្រៀមខ្លួនសម្រាប់អាជីព",
        "Get ready for your future with expert guides and tools.": "ត្រៀមខ្លួនសម្រាប់អនាគតរបស់អ្នកជាមួយមគ្គុទ្ទេសក៍ និងឧបករណ៍ពីអ្នកជំនាញ។",
        "CV Guide": "មគ្គុទ្ទេសក៍ CV",
        "Learn how to create a professional and ATS-friendly CV.": "រៀនបង្កើត CV ប្រកបដោយវិជ្ជាជីវៈ និងសមស្របនឹងប្រព័ន្ធ ATS។",
        "Interview Guide": "មគ្គុទ្ទេសក៍សម្ភាសន៍",
        "Prepare for interviews with tips and common questions.": "ត្រៀមសម្ភាសន៍ដោយប្រើគន្លឹះ និងសំណួរដែលគេសួរញឹកញាប់។",
        "Skills Development": "ការអភិវឌ្ឍជំនាញ",
        "Discover in-demand skills and how to learn them.": "ស្វែងរកជំនាញដែលមានតម្រូវការ និងរបៀបរៀនជំនាញទាំងនោះ។",
        "What Students Say": "មតិរបស់សិស្ស",
        "Join thousands of students who have benefited from InternGuide.": "ចូលរួមជាមួយសិស្សរាប់ពាន់នាក់ដែលទទួលបានអត្ថប្រយោជន៍ពី InternGuide។",
        "Ready to Start Your Career Journey?": "ត្រៀមចាប់ផ្តើមដំណើរអាជីពរបស់អ្នកហើយឬនៅ?",
        "Join InternGuide today and take the first step towards a brighter future.": "ចូលរួម InternGuide ថ្ងៃនេះ ហើយចាប់ផ្តើមជំហានដំបូងឆ្ពោះទៅកាន់អនាគតដ៏ភ្លឺស្វាង។",
        "It's free and always will be.": "វាឥតគិតថ្លៃ ហើយនឹងនៅតែឥតគិតថ្លៃជានិច្ច។",
        "Privacy Policy": "គោលការណ៍ឯកជនភាព",
        "Terms of Service": "លក្ខខណ្ឌសេវាកម្ម",
        "All rights reserved.": "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
        "Search internships, companies, or skills...": "ស្វែងរកកម្មសិក្សា ក្រុមហ៊ុន ឬជំនាញ...",
        "Search title, company, category...": "ស្វែងរកចំណងជើង ក្រុមហ៊ុន ឬប្រភេទ...",
        "Search anything...": "ស្វែងរកអ្វីក៏បាន...",
        "Find the Right Internship for You": "ស្វែងរកកម្មសិក្សាដែលសមស្របសម្រាប់អ្នក",
        "Explore verified internship opportunities, discover essential skills, and build industry-ready experience tailored to your long-term career ambition.": "ស្វែងរកឱកាសកម្មសិក្សាដែលបានផ្ទៀងផ្ទាត់ ស្វែងយល់ពីជំនាញសំខាន់ៗ និងទទួលបទពិសោធន៍ត្រៀមខ្លួនសម្រាប់ឧស្សាហកម្ម ដើម្បីសម្រេចគោលដៅអាជីពរយៈពេលវែង។",
        "Internship Opportunities": "ឱកាសកម្មសិក្សា",
        "Find the Right": "ស្វែងរក",
        "Internship": "កម្មសិក្សា",
        "for You": "ដែលសមស្របសម្រាប់អ្នក",
        "Work with an engineering team to build and improve web applications while gaining practical software development experience": "ធ្វើការជាមួយក្រុមវិស្វកម្មដើម្បីបង្កើត និងកែលម្អកម្មវិធីគេហទំព័រ ព្រមទាំងទទួលបទពិសោធន៍អភិវឌ្ឍកម្មវិធីជាក់ស្តែង។",
        "Select company": "ជ្រើសរើសក្រុមហ៊ុន",
        "All Status": "ស្ថានភាពទាំងអស់",
        "All Categories": "ប្រភេទទាំងអស់",
        "Pending": "កំពុងរង់ចាំ",
        "Approved": "បានអនុម័ត",
        "Drafts": "សេចក្តីព្រាង",
        "Active": "សកម្ម",
        "Add Internship": "បន្ថែមកម្មសិក្សា",
        "Save Internship": "រក្សាទុកកម្មសិក្សា",
        "Create or update an internship listing.": "បង្កើត ឬធ្វើបច្ចុប្បន្នភាពប្រកាសកម្មសិក្សា។",
        "Internship Title *": "ចំណងជើងកម្មសិក្សា *",
        "Company *": "ក្រុមហ៊ុន *",
        "Application URL": "តំណភ្ជាប់ដាក់ពាក្យ",
        "Requirements": "លក្ខខណ្ឌតម្រូវ",
        "Description": "ការពិពណ៌នា",
        "Manage InternGuide students and administrators.": "គ្រប់គ្រងសិស្ស និងអ្នកគ្រប់គ្រង InternGuide។",
        "Administrator": "អ្នកគ្រប់គ្រង",
        "Total Users": "អ្នកប្រើប្រាស់សរុប",
        "Total Internships": "កម្មសិក្សាសរុប",
        "Active Internships": "កម្មសិក្សាសកម្ម",
        "Applications and company-management modules are not counted here because their database tables were not part of the supplied dashboard data. This prevents demo numbers from being presented as real data.": "ម៉ូឌុលពាក្យសុំ និងការគ្រប់គ្រងក្រុមហ៊ុនមិនត្រូវបានរាប់បញ្ចូលទេ ព្រោះតារាងទិន្នន័យរបស់វាមិនមាននៅក្នុងទិន្នន័យផ្ទាំងគ្រប់គ្រងដែលបានផ្តល់។ វាជួយជៀសវាងការបង្ហាញចំនួនសាកល្បងជាទិន្នន័យពិត។",
        "Add career advice and resources for students.": "បន្ថែមដំបូន្មានអាជីព និងធនធានសម្រាប់សិស្ស។",
        "Create and publish new internship opportunities.": "បង្កើត និងផ្សព្វផ្សាយឱកាសកម្មសិក្សាថ្មី។",
        "View and manage all users, students, and administrators.": "មើល និងគ្រប់គ្រងអ្នកប្រើប្រាស់ សិស្ស និងអ្នកគ្រប់គ្រងទាំងអស់។",
        "Check platform analytics and generate reports.": "ពិនិត្យការវិភាគវេទិកា និងបង្កើតរបាយការណ៍។",
        "Manage internship opportunities published on InternGuide.": "គ្រប់គ្រងឱកាសកម្មសិក្សាដែលបានផ្សព្វផ្សាយនៅលើ InternGuide។",
        "No registered users yet.": "មិនទាន់មានអ្នកប្រើប្រាស់ដែលបានចុះឈ្មោះទេ។",
        "No internships found.": "រកមិនឃើញកម្មសិក្សាទេ។",
        "Unable to load dashboard data.": "មិនអាចផ្ទុកទិន្នន័យផ្ទាំងគ្រប់គ្រងបានទេ។",
        "Unable to load users.": "មិនអាចផ្ទុកអ្នកប្រើប្រាស់បានទេ។",
        "Unable to load internships.": "មិនអាចផ្ទុកកម្មសិក្សាបានទេ។",
        "No internship records yet.": "មិនទាន់មានកំណត់ត្រាកម្មសិក្សាទេ។",
        "No internship statuses yet.": "មិនទាន់មានស្ថានភាពកម្មសិក្សាទេ។",
        "Are you sure you want to logout?": "តើអ្នកប្រាកដថាចង់ចាកចេញមែនទេ?",
        "Unable to logout. Please try again.": "មិនអាចចាកចេញបានទេ។ សូមព្យាយាមម្តងទៀត។",
        "English": "អង់គ្លេស",
        "ខ្មែរ": "ខ្មែរ",
        "Active Trajectory": "ដំណើរអាជីពសកម្ម",
        "Gain Real Experience": "ទទួលបទពិសោធន៍ជាក់ស្តែង",
        "Verified Roadmaps": "ផែនទីអាជីពដែលបានផ្ទៀងផ្ទាត់",
        "Explore 120+ Paths": "ស្វែងយល់ពីផ្លូវអាជីពជាង ១២០",
        "Explore Your Future": "ស្វែងរកអនាគតរបស់អ្នក",
        "Discover the Right Career": "ស្វែងរកអាជីពដែលសមស្រប",
        "Path for You": "សម្រាប់អ្នក",
        "Explore different careers, understand the skills you need, and discover opportunities that match your interests and goals.": "ស្វែងយល់ពីអាជីពផ្សេងៗ យល់ដឹងពីជំនាញដែលអ្នកត្រូវការ និងរកឱកាសដែលស្របតាមចំណាប់អារម្មណ៍ និងគោលដៅរបស់អ្នក។",
        "Learn what each career involves and what skills you need to get started.": "ស្វែងយល់ពីការងារនៃអាជីពនីមួយៗ និងជំនាញដែលអ្នកត្រូវការដើម្បីចាប់ផ្តើម។",
        "Key Skills": "ជំនាញសំខាន់ៗ",
        "Related Roles": "តួនាទីពាក់ព័ន្ធ",
        "View Career": "មើលអាជីព",
        "High Demand": "មានតម្រូវការខ្ពស់",
        "Fast Growing": "កំពុងរីកចម្រើនលឿន",
        "Creative & Strategic": "ច្នៃប្រឌិត និងមានយុទ្ធសាស្ត្រ",
        "High impact": "មានឥទ្ធិពលខ្ពស់",
        "Build the Skills Employers Look For": "អភិវឌ្ឍជំនាញដែលនិយោជកត្រូវការ",
        "Understand the technical and professional skills you need to prepare for your future career.": "ស្វែងយល់ពីជំនាញបច្ចេកទេស និងវិជ្ជាជីវៈដែលអ្នកត្រូវការសម្រាប់អាជីពនាពេលអនាគត។",
        "TECHNICAL SKILLS": "ជំនាញបច្ចេកទេស",
        "PROFESSIONAL SKILLS": "ជំនាញវិជ្ជាជីវៈ",
        "Programming:": "ការសរសេរកម្មវិធី៖",
        "Data Analysis:": "ការវិភាគទិន្នន័យ៖",
        "UI/UX Design:": "ការរចនា UI/UX៖",
        "Digital Marketing:": "ទីផ្សារឌីជីថល៖",
        "Communication:": "ការទំនាក់ទំនង៖",
        "Teamwork:": "ការងារជាក្រុម៖",
        "Problem Solving:": "ការដោះស្រាយបញ្ហា៖",
        "Time Management:": "ការគ្រប់គ្រងពេលវេលា៖",
        "Not Sure Which Career Is Right for You?": "មិនប្រាកដថាអាជីពមួយណាសមស្របសម្រាប់អ្នកមែនទេ?",
        "Start with your interests and discover careers that could match your strengths.": "ចាប់ផ្តើមពីចំណាប់អារម្មណ៍របស់អ្នក ហើយស្វែងរកអាជីពដែលត្រូវនឹងចំណុចខ្លាំងរបស់អ្នក។",
        "Discover Your Interests": "ស្វែងយល់ពីចំណាប់អារម្មណ៍របស់អ្នក",
        "Identify academic subjects, extracurriculars, and project activities you genuinely enjoy.": "កំណត់មុខវិជ្ជាសិក្សា សកម្មភាពក្រៅម៉ោង និងគម្រោងដែលអ្នកពិតជាចូលចិត្ត។",
        "Explore Career Options": "ស្វែងរកជម្រើសអាជីព",
        "Learn about distinct professional industries, job responsibilities, and market requirements.": "ស្វែងយល់អំពីវិស័យវិជ្ជាជីវៈ ភារកិច្ចការងារ និងតម្រូវការទីផ្សារ។",
        "Build Your Skills": "អភិវឌ្ឍជំនាញរបស់អ្នក",
        "Find actionable project courses, internships, and entry points needed to get properly started.": "ស្វែងរកវគ្គគម្រោង កម្មសិក្សា និងឱកាសចាប់ផ្តើមដែលអាចជួយអ្នកចូលទៅក្នុងអាជីពបាន។",
        "Your Future Starts With One Step": "អនាគតរបស់អ្នកចាប់ផ្តើមពីមួយជំហាន",
        "Explore Explore careers, build your skills, and find opportunities with InternGuide.": "ស្វែងយល់ពីអាជីព អភិវឌ្ឍជំនាញ និងស្វែងរកឱកាសជាមួយ InternGuide។",
        "Learn more": "ស្វែងយល់បន្ថែម",
        "Career Preparation": "ការត្រៀមខ្លួនសម្រាប់អាជីព",
        "ATS-Friendly & Mock Prep": "សមស្របនឹង ATS និងការត្រៀមសម្ភាសន៍សាកល្បង",
        "Reviewed by top enterprise recruiters": "បានពិនិត្យដោយអ្នកជ្រើសរើសបុគ្គលិកឈានមុខ",
        "Create a Professional CV": "បង្កើត CV ប្រកបដោយវិជ្ជាជីវៈ",
        "Build a CV that clearly presents your education, skills, experience, and achievements.": "បង្កើត CV ដែលបង្ហាញយ៉ាងច្បាស់ពីការអប់រំ ជំនាញ បទពិសោធន៍ និងសមិទ្ធផលរបស់អ្នក។",
        "Computer Science Undergraduate": "និស្សិតថ្នាក់បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ",
        "EDUCATION": "ការអប់រំ",
        "TECHNICAL SKILLS": "ជំនាញបច្ចេកទេស",
        "FEATURED PROJECTS": "គម្រោងសំខាន់ៗ",
        "LEADERSHIP & CAMPUS": "ភាពជាអ្នកដឹកនាំ និងសកម្មភាពសាកលវិទ្យាល័យ",
        "ATS Grade: 98% Optimal": "ពិន្ទុ ATS៖ ល្អបំផុត ៩៨%",
        "Single Page • Standard Letter": "មួយទំព័រ • ទំហំសំបុត្រស្តង់ដារ",
        "Personal Information": "ព័ត៌មានផ្ទាល់ខ្លួន",
        "Include your name, professional email, phone number, and links to your GitHub or LinkedIn profile. Keep it concise.": "បញ្ចូលឈ្មោះ អ៊ីមែលវិជ្ជាជីវៈ លេខទូរស័ព្ទ និងតំណភ្ជាប់ GitHub ឬ LinkedIn របស់អ្នក។ សរសេរឱ្យខ្លីច្បាស់។",
        "Show your university, degree program, expected graduation year, and academic achievements or honors.": "បង្ហាញសាកលវិទ្យាល័យ កម្មវិធីសិក្សា ឆ្នាំបញ្ចប់ការសិក្សាដែលរំពឹងទុក និងសមិទ្ធផល ឬកិត្តិយសសិក្សា។",
        "Highlight technical competencies (software, coding languages, tools) alongside verified soft skills like communication and problem-solving.": "បង្ហាញសមត្ថភាពបច្ចេកទេស (កម្មវិធី ភាសាសរសេរកូដ ឧបករណ៍) និងជំនាញទន់ដូចជាការទំនាក់ទំនង និងការដោះស្រាយបញ្ហា។",
        "Include prior internships, academic capstones, volunteer initiatives, and part-time responsibilities with tangible results.": "បញ្ចូលកម្មសិក្សា គម្រោងបញ្ចប់ការសិក្សា ការងារស្ម័គ្រចិត្ត និងការងារក្រៅម៉ោងដែលមានលទ្ធផលជាក់ស្តែង។",
        "Show certifications, competitions, awards, and open-source contributions to illustrate your initiative.": "បង្ហាញវិញ្ញាបនបត្រ ការប្រកួតប្រជែង ពានរង្វាន់ និងការចូលរួមក្នុងគម្រោងប្រភពបើកចំហ ដើម្បីបញ្ជាក់ពីគំនិតផ្តួចផ្តើមរបស់អ្នក។",
        "Learn How to Write Your CV": "រៀនសរសេរ CV របស់អ្នក",
        "CV Checklist": "បញ្ជីត្រួតពិនិត្យ CV",
        "Make sure your CV includes the information employers expect.": "ត្រូវប្រាកដថា CV របស់អ្នកមានព័ត៌មានដែលនិយោជករំពឹងទុក។",
        "Clear contact information": "ព័ត៌មានទំនាក់ទំនងច្បាស់លាស់",
        "Professional profile": "ប្រវត្តិរូបវិជ្ជាជីវៈ",
        "Relevant skills": "ជំនាញពាក់ព័ន្ធ",
        "Experience or projects": "បទពិសោធន៍ ឬគម្រោង",
        "Achievements": "សមិទ្ធផល",
        "Correct formatting": "ទម្រង់ត្រឹមត្រូវ",
        "No unnecessary info": "មិនមានព័ត៌មានមិនចាំបាច់",
        "Tip:": "គន្លឹះ៖",
        "Keep your CV clear, organized, and easy to read. Recruiters spend an average of 6 seconds on first passes.": "សរសេរ CV ឱ្យច្បាស់ រៀបចំបានល្អ និងងាយអាន។ អ្នកជ្រើសរើសបុគ្គលិកចំណាយពេលជាមធ្យម ៦ វិនាទីក្នុងការពិនិត្យដំបូង។",
        "Prepare for Your Internship Interview": "ត្រៀមខ្លួនសម្រាប់សម្ភាសន៍កម្មសិក្សា",
        "Build confidence by understanding what to expect and practicing your answers.": "បង្កើនទំនុកចិត្តដោយស្វែងយល់ពីអ្វីដែលត្រូវរំពឹង និងហាត់ឆ្លើយសំណួរ។",
        "Before the Interview": "មុនពេលសម្ភាសន៍",
        "Research the company, read recent news, study the mission statement, and understand the core internship role requirements.": "ស្រាវជ្រាវអំពីក្រុមហ៊ុន អានព័ត៌មានថ្មីៗ សិក្សាបេសកកម្ម និងយល់ពីលក្ខខណ្ឌសំខាន់ៗនៃតួនាទីកម្មសិក្សា។",
        "Common Questions": "សំណួរដែលគេសួរញឹកញាប់",
        "Practice questions about your background, personal skills, academic projects, team experiences, and long-term career goals.": "ហាត់ឆ្លើយសំណួរអំពីប្រវត្តិ ជំនាញ គម្រោងសិក្សា បទពិសោធន៍ការងារជាក្រុម និងគោលដៅអាជីពរយៈពេលវែងរបស់អ្នក។",
        "Answer Clearly": "ឆ្លើយឱ្យច្បាស់",
        "Use specific examples when explaining your skills and experience. Structure answers with Situation, Task, Action, and Result (STAR).": "ប្រើឧទាហរណ៍ជាក់លាក់ពេលពន្យល់ពីជំនាញ និងបទពិសោធន៍។ រៀបចំចម្លើយតាមរបៀប ស្ថានភាព ភារកិច្ច សកម្មភាព និងលទ្ធផល (STAR)។",
        "Ask Questions": "សួរសំណួរ",
        "Prepare thoughtful questions to ask the interviewer regarding team culture, mentorship models, and upcoming project cycles.": "ត្រៀមសំណួរដែលមានអត្ថន័យសម្រាប់សួរអ្នកសម្ភាសន៍អំពីវប្បធម៌ក្រុម ការណែនាំ និងវដ្តគម្រោងនាពេលខាងមុខ។",
        "Common Interview Questions": "សំណួរសម្ភាសន៍ដែលគេសួរញឹកញាប់",
        "Practice answering questions you may be asked during an internship interview.": "ហាត់ឆ្លើយសំណួរដែលអាចត្រូវបានសួរនៅពេលសម្ភាសន៍កម្មសិក្សា។",
        "Tell me about yourself.": "សូមណែនាំខ្លួនអ្នក។",
        "Why are you interested in this internship?": "ហេតុអ្វីបានជាអ្នកចាប់អារម្មណ៍លើកម្មសិក្សានេះ?",
        "Why did you choose your field of study?": "ហេតុអ្វីបានជាអ្នកជ្រើសរើសមុខជំនាញនេះ?",
        "What skills can you bring to this internship?": "តើអ្នកអាចនាំយកជំនាញអ្វីខ្លះមកកាន់កម្មសិក្សានេះ?",
        "Tell me about a project you worked on.": "សូមប្រាប់អំពីគម្រោងដែលអ្នកបានធ្វើ។",
        "What is one challenge you have faced and how did you solve it?": "តើបញ្ហាប្រឈមមួយណាដែលអ្នកធ្លាប់ជួប ហើយអ្នកបានដោះស្រាយវាយ៉ាងដូចម្តេច?",
        "About InternGuide": "អំពី InternGuide",
        "Helping Students Find Opportunities and Build Their": "ជួយសិស្សស្វែងរកឱកាស និងកសាង",
        "Future": "អនាគត",
        "Explore Internships": "ស្វែងរកកម្មសិក្សា",
        "Purpose & Value": "គោលបំណង និងតម្លៃ",
        "Why InternGuide?": "ហេតុអ្វី InternGuide?",
        "Find Opportunities": "ស្វែងរកឱកាស",
        "Discover internship positions that match your specific passions, academic field, and career trajectories.": "ស្វែងរកមុខតំណែងកម្មសិក្សាដែលត្រូវនឹងចំណង់ចំណូលចិត្ត មុខជំនាញសិក្សា និងផ្លូវអាជីពរបស់អ្នក។",
        "Filter by role": "ត្រងតាមតួនាទី",
        "Explore Career Paths": "ស្វែងយល់ពីផ្លូវអាជីព",
        "Learn about emerging industries, real-world day-to-day responsibilities, and long-term career growth.": "ស្វែងយល់អំពីវិស័យកំពុងរីកចម្រើន ភារកិច្ចប្រចាំថ្ងៃជាក់ស្តែង និងការរីកចម្រើនអាជីពរយៈពេលវែង។",
        "Browse 40+ paths": "រកមើលផ្លូវអាជីពជាង ៤០",
        "Prepare Your Application": "ត្រៀមពាក្យសុំរបស់អ្នក",
        "Get battle-tested advice for tailoring CVs, building portfolio showcases, and answering tough interview prompts.": "ទទួលដំបូន្មានជាក់ស្តែងសម្រាប់កែសម្រួល CV បង្កើតសំណុំស្នាដៃ និងឆ្លើយសំណួរសម្ភាសន៍ពិបាកៗ។",
        "ATS-ready guides": "មគ្គុទ្ទេសក៍ត្រៀមសម្រាប់ ATS",
        "Build Your Skills": "អភិវឌ្ឍជំនាញរបស់អ្នក",
        "Master the essential hard and soft proficiencies demanded by top companies hiring entry-level talent today.": "ពង្រឹងជំនាញបច្ចេកទេស និងជំនាញទន់សំខាន់ៗដែលក្រុមហ៊ុនឈានមុខត្រូវការពីបុគ្គលិកកម្រិតដំបូង។",
        "Skills matrices": "តារាងជំនាញ",
        "CORE FOCUS": "ចំណុចផ្តោតសំខាន់",
        "Our Mission": "បេសកកម្មរបស់យើង",
        "Our mission is to make career and internship preparation easier and equitable for all students by providing verified, actionable information through one clear, structured platform.": "បេសកកម្មរបស់យើងគឺធ្វើឱ្យការត្រៀមខ្លួនសម្រាប់អាជីព និងកម្មសិក្សាកាន់តែងាយស្រួល និងស្មើភាពសម្រាប់សិស្សទាំងអស់ តាមរយៈព័ត៌មានដែលបានផ្ទៀងផ្ទាត់ និងអាចអនុវត្តបាននៅលើវេទិកាច្បាស់លាស់មួយ។",
        "The InternGuide Pathway": "ដំណើររបស់ InternGuide",
        "DISCOVER": "ស្វែងយល់",
        "Identify relevant roles & programs": "កំណត់តួនាទី និងកម្មវិធីដែលពាក់ព័ន្ធ",
        "EXPLORE": "រុករក",
        "Examine prerequisites & industry pathways": "ពិនិត្យលក្ខខណ្ឌ និងផ្លូវក្នុងវិស័យ",
        "PREPARE": "ត្រៀមខ្លួន",
        "Refine portfolios, resume & technique": "កែលម្អសំណុំស្នាដៃ ប្រវត្តិរូប និងបច្ចេកទេស",
        "APPLY": "ដាក់ពាក្យ",
        "Submit with complete preparedness": "ដាក់ពាក្យដោយបានត្រៀមខ្លួនរួចរាល់",
        "CLEAR FRAMEWORK": "ដំណើរការច្បាស់លាស់",
        "How InternGuide Works": "របៀបប្រើ InternGuide",
        "Everything students need is organized into four intuitive, structured phases.": "អ្វីៗដែលសិស្សត្រូវការត្រូវបានរៀបចំជាបួនដំណាក់កាលងាយយល់ និងមានរចនាសម្ព័ន្ធ។",
        "Get in Touch": "ទាក់ទងមកយើង",
        "Have questions, feedback, or need guidance using the platform? Send our student counseling & support team a direct note.": "មានសំណួរ មតិកែលម្អ ឬត្រូវការការណែនាំក្នុងការប្រើវេទិកាមែនទេ? ផ្ញើសារទៅក្រុមប្រឹក្សា និងជំនួយសិស្សរបស់យើង។",
        "Email our support desk": "អ៊ីមែលទៅកាន់ផ្នែកជំនួយ",
        "Regional Headquarters": "ទីស្នាក់ការកណ្តាលប្រចាំតំបន់",
        "Connect with our student communities": "ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍សិស្សរបស់យើង",
        "Send us a Message": "ផ្ញើសារមកយើង",
        "Fill out the form below and an advisor will respond within 24 hours.": "បំពេញទម្រង់ខាងក្រោម ហើយអ្នកប្រឹក្សានឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។",
        "Full Name": "ឈ្មោះពេញ",
        "Email Address": "អាសយដ្ឋានអ៊ីមែល",
        "Enter your name": "បញ្ចូលឈ្មោះរបស់អ្នក",
        "Enter your email": "បញ្ចូលអ៊ីមែលរបស់អ្នក",
        "Subject": "ប្រធានបទ",
        "What is your message about?": "តើសាររបស់អ្នកនិយាយអំពីអ្វី?",
        "Message": "សារ",
        "Write your message here...": "សរសេរសាររបស់អ្នកនៅទីនេះ...",
        "Send Message": "ផ្ញើសារ",
        "INQUIRIES": "សំណួរ និងការសាកសួរ",
        "Frequently Asked Questions": "សំណួរដែលគេសួរញឹកញាប់",
        "Quick answers to common questions about using InternGuide.": "ចម្លើយរហ័សចំពោះសំណួរទូទៅអំពីការប្រើ InternGuide។",
        "What is InternGuide?": "តើ InternGuide ជាអ្វី?",
        "Who is InternGuide for?": "តើ InternGuide សម្រាប់អ្នកណា?",
        "Can I use InternGuide to prepare for an interview?": "តើខ្ញុំអាចប្រើ InternGuide ដើម្បីត្រៀមសម្ភាសន៍បានទេ?",
        "How can I contact the InternGuide team?": "តើខ្ញុំអាចទាក់ទងក្រុម InternGuide តាមរបៀបណា?",
        "Explore vetted opportunities, discover tailored career paths, and prepare for your next professional milestone with InternGuide.": "ស្វែងរកឱកាសដែលបានផ្ទៀងផ្ទាត់ ស្វែងយល់ពីផ្លូវអាជីពសមស្រប និងត្រៀមខ្លួនសម្រាប់ជំហានវិជ្ជាជីវៈបន្ទាប់ជាមួយ InternGuide។",
        "Filter Internships": "ត្រងរកកម្មសិក្សា",
        "Reset All Filters": "កំណត់តម្រងទាំងអស់ឡើងវិញ",
        "Featured Internship Opportunities": "ឱកាសកម្មសិក្សាពិសេស",
        "Showing": "កំពុងបង្ហាញ",
        "internship opportunities": "ឱកាសកម្មសិក្សា",
        "Sort by: Most Relevant": "តម្រៀបតាម៖ ពាក់ព័ន្ធបំផុត",
        "Sort by: Newest First": "តម្រៀបតាម៖ ថ្មីបំផុត",
        "Work Mode": "របៀបធ្វើការ",
        "On-site": "នៅទីតាំងការងារ",
        "Full-time": "ពេញម៉ោង",
        "Part-time": "ក្រៅម៉ោង",
        "months": "ខែ",
        "Career Field": "វិស័យអាជីព",
        "skills": "ជំនាញ",
        "Reset All Filters": "កំណត់តម្រងទាំងអស់ឡើងវិញ",
        "The career guides and interview tips are super useful. Highly recommended!": "មគ្គុទ្ទេសក៍អាជីព និងគន្លឹះសម្ភាសន៍មានប្រយោជន៍ខ្លាំងណាស់។ ខ្ញុំសូមណែនាំ!",
        "A one-stop platform for everything I need for my career journey.": "វេទិកាតែមួយដែលមានអ្វីៗគ្រប់យ៉ាងដែលខ្ញុំត្រូវការសម្រាប់ដំណើរអាជីព។",
        "InternGuide helped me find the perfect internship and gave me the confidence to apply!": "InternGuide បានជួយខ្ញុំស្វែងរកកម្មសិក្សាដែលសមស្រប និងផ្តល់ទំនុកចិត្តឱ្យខ្ញុំដាក់ពាក្យ!",
        "Computer Science Student": "និស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ",
        "Business Student": "និស្សិតផ្នែកពាណិជ្ជកម្ម",
        "IT Student": "និស្សិតបច្ចេកវិទ្យាព័ត៌មាន",
        "View All Testimonials": "មើលមតិទាំងអស់",
        "Filter Internships": "ត្រងរកកម្មសិក្សា",
        "Reset All Filters": "កំណត់តម្រងទាំងអស់ឡើងវិញ",
        "Sort by: Most Relevant": "តម្រៀបតាម៖ ពាក់ព័ន្ធបំផុត",
        "Sort by: Newest First": "តម្រៀបតាម៖ ថ្មីបំផុត",
        "Featured Internship Opportunities": "ឱកាសកម្មសិក្សាពិសេស",
        "Showing": "កំពុងបង្ហាញ",
        "internship opportunities": "ឱកាសកម្មសិក្សា",
        "On-site": "នៅទីតាំងការងារ",
        "Hybrid": "បែបចម្រុះ",
        "Full-time": "ពេញម៉ោង",
        "Part-time": "ក្រៅម៉ោង",
        "Remote": "ពីចម្ងាយ",
        "Full-time Internship": "កម្មសិក្សាពេញម៉ោង",
        "Part-time Internship": "កម្មសិក្សាក្រៅម៉ោង",
        "Summer Internship": "កម្មសិក្សារដូវក្តៅ",
        "Battambang": "បាត់ដំបង",
        "Siem Reap": "សៀមរាប",
        "1–3 months": "១–៣ ខែ",
        "3–6 months": "៣–៦ ខែ",
        "6+ months": "៦ ខែឡើងទៅ",
        "Career Field": "វិស័យអាជីព",
        "Reset All Filters": "កំណត់តម្រងទាំងអស់ឡើងវិញ",
        "Preview": "មើលជាមុន",
        "Download": "ទាញយក",
        "Preview CV": "មើល CV ជាមុន",
        "Download / Print PDF": "ទាញយក / បោះពុម្ព PDF",
        "Live CV Preview": "មើល CV ផ្ទាល់",
        "A4-style preview": "ទម្រង់មើលជាមុន A4",
        "Profile Information": "ព័ត៌មានប្រវត្តិរូប",
        "Personal Details": "ព័ត៌មានផ្ទាល់ខ្លួន",
        "Contact Information": "ព័ត៌មានទំនាក់ទំនង",
        "Professional Summary": "សេចក្តីសង្ខេបវិជ្ជាជីវៈ",
        "PROFESSIONAL SUMMARY": "សេចក្តីសង្ខេបវិជ្ជាជីវៈ",
        "EDUCATION": "ការអប់រំ",
        "EXPERIENCE": "បទពិសោធន៍",
        "WORK EXPERIENCE": "បទពិសោធន៍ការងារ",
        "PROJECTS": "គម្រោង",
        "SKILLS": "ជំនាញ",
        "LANGUAGES": "ភាសា",
        "CERTIFICATES": "វិញ្ញាបនបត្រ",
        "REFERENCES": "ឯកសារយោង",
        "Optional Certificates": "វិញ្ញាបនបត្រជាជម្រើស",
        "Profile information will appear here.": "ព័ត៌មានប្រវត្តិរូបនឹងបង្ហាញនៅទីនេះ។",
        "Your profile information has been added to the CV.": "ព័ត៌មានប្រវត្តិរូបរបស់អ្នកត្រូវបានបន្ថែមទៅក្នុង CV។",
        "Smart AI CV Builder": "កម្មវិធីបង្កើត CV ដោយ Smart AI",
        "Tell Smart AI about yourself": "ប្រាប់ Smart AI អំពីខ្លួនអ្នក",
        "Smart AI Result": "លទ្ធផល Smart AI",
        "Create Your CV": "បង្កើត CV របស់អ្នក",
        "Save CV": "រក្សាទុក CV",
        "Save Changes": "រក្សាទុកការផ្លាស់ប្តូរ",
        "Add Education": "បន្ថែមការអប់រំ",
        "Add Experience": "បន្ថែមបទពិសោធន៍",
        "Add Project": "បន្ថែមគម្រោង",
        "Add Certificate": "បន្ថែមវិញ្ញាបនបត្រ",
        "Add Skill": "បន្ថែមជំនាញ",
        "Add Language": "បន្ថែមភាសា",
        "Your Name": "ឈ្មោះរបស់អ្នក",
        "References": "ឯកសារយោង",
        "Optional": "ជាជម្រើស",
        "Required": "តម្រូវឱ្យបំពេញ",
        "Cancel": "បោះបង់",
        "Save": "រក្សាទុក",
        "Close": "បិទ",
        "Next": "បន្ទាប់",
        "Back": "ត្រឡប់ក្រោយ",
        "Continue": "បន្ត",
        "Create": "បង្កើត",
        "Preview & Download": "មើលជាមុន និងទាញយក",
        "Step 1": "ជំហានទី ១",
        "Step 2": "ជំហានទី ២",
        "Step 3": "ជំហានទី ៣",
        "Step 4": "ជំហានទី ៤",
        "Step 5": "ជំហានទី ៥",
        "Language switcher": "ប្តូរភាសា",
        "Open menu": "បើកម៉ឺនុយ",
        "Loading career guides...": "កំពុងផ្ទុកមគ្គុទ្ទេសក៍អាជីព...",
        "No career guides found.": "រកមិនឃើញមគ្គុទ្ទេសក៍អាជីពទេ។",
        "Career": "អាជីព",
        "Explore the key details for this career path.": "ស្វែងយល់ពីព័ត៌មានសំខាន់ៗនៃផ្លូវអាជីពនេះ។",
        "Search title, company, category...": "ស្វែងរកចំណងជើង ក្រុមហ៊ុន ឬប្រភេទ...",
        "All Status": "ស្ថានភាពទាំងអស់",
        "All Categories": "ប្រភេទទាំងអស់",
        "Internship Title *": "ចំណងជើងកម្មសិក្សា *",
        "Create or update an internship listing.": "បង្កើត ឬធ្វើបច្ចុប្បន្នភាពប្រកាសកម្មសិក្សា។",
        "Are you sure you want to logout?": "តើអ្នកប្រាកដថាចង់ចាកចេញមែនទេ?",
        "No internship experience added yet.": "មិនទាន់មានបទពិសោធន៍កម្មសិក្សាទេ។",
        "© 2026 InternGuide. All rights reserved.": "© ២០២៦ InternGuide។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
        "My Profile | InternGuide": "ប្រវត្តិរូបរបស់ខ្ញុំ | InternGuide",
        "Login | InternGuide": "ចូលគណនី | InternGuide",
        "Sign Up | InternGuide": "បង្កើតគណនី | InternGuide",
        "Admin Dashboard | InternGuide": "ផ្ទាំងគ្រប់គ្រង | InternGuide",
        "Users | InternGuide Admin": "អ្នកប្រើប្រាស់ | អ្នកគ្រប់គ្រង InternGuide",
        "Internships Management - InternGuide Admin": "ការគ្រប់គ្រងកម្មសិក្សា - អ្នកគ្រប់គ្រង InternGuide",
        "Career Guides - InternGuide Admin": "មគ្គុទ្ទេសក៍អាជីព - អ្នកគ្រប់គ្រង InternGuide",
        "Technology": "បច្ចេកវិទ្យា",
        "Business": "ពាណិជ្ជកម្ម",
        "Design": "ការរចនា",
        "Engineering": "វិស្វកម្ម",
        "Science": "វិទ្យាសាស្ត្រ",
        "Marketing": "ទីផ្សារ",
        "Software Development": "ការអភិវឌ្ឍកម្មវិធី",
        "UX/UI Design": "ការរចនា UX/UI",
        "Analytics": "ការវិភាគ",
        "CV Builder": "កម្មវិធីបង្កើត CV",
        "Create Your Professional CV": "បង្កើត CV ប្រកបដោយវិជ្ជាជីវៈរបស់អ្នក",
        "Start with your profile, let the AI assistant help write your content, then preview and download your CV.": "ចាប់ផ្តើមពីប្រវត្តិរូបរបស់អ្នក ហើយឱ្យជំនួយការ AI ជួយសរសេរខ្លឹមសារ បន្ទាប់មកមើលជាមុន និងទាញយក CV របស់អ្នក។",
        "CV creation progress": "ដំណើរការបង្កើត CV",
        "Template": "គំរូ",
        "Information": "ព័ត៌មាន",
        "Customize": "ប្ដូរតាមបំណង",
        "Choose Your CV Template": "ជ្រើសរើសគំរូ CV របស់អ្នក",
        "Select a professional layout that matches your career goals. You can change your template anytime without losing your information.": "ជ្រើសរើសប្លង់វិជ្ជាជីវៈដែលសមស្របនឹងគោលដៅអាជីពរបស់អ្នក។ អ្នកអាចប្ដូរគំរូបានគ្រប់ពេលដោយមិនបាត់បង់ព័ត៌មាន។",
        "Accent color": "ពណ៌លេចធ្លោ",
        "A restrained highlight used for headings and dividers.": "ពណ៌សង្កត់ស្រាលសម្រាប់ចំណងជើង និងបន្ទាត់បែងចែក។",
        "Choose an accent color": "ជ្រើសរើសពណ៌លេចធ្លោ",
        "Blue accent": "ពណ៌ខៀវលេចធ្លោ",
        "Navy accent": "ពណ៌ខៀវទឹកសមុទ្រលេចធ្លោ",
        "Green accent": "ពណ៌បៃតងលេចធ្លោ",
        "Purple accent": "ពណ៌ស្វាយលេចធ្លោ",
        "Teal accent": "ពណ៌ខៀវបៃតងលេចធ្លោ",
        "Gray accent": "ពណ៌ប្រផេះលេចធ្លោ",
        "Show sections": "បង្ហាញផ្នែក",
        "Empty sections stay hidden automatically.": "ផ្នែកដែលគ្មានព័ត៌មាននឹងត្រូវបានលាក់ដោយស្វ័យប្រវត្តិ។",
        "Example for students": "ឧទាហរណ៍សម្រាប់សិស្ស",
        "Write naturally. You do not need perfect grammar. Smart AI will organize the information for you.": "សរសេរតាមធម្មតា។ អ្នកមិនចាំបាច់ប្រើវេយ្យាករណ៍ល្អឥតខ្ចោះទេ។ Smart AI នឹងរៀបចំព័ត៌មានជូនអ្នក។",
        "Use Example": "ប្រើឧទាហរណ៍",
        "Clear": "សម្អាត",
        "Build My Full CV": "បង្កើត CV ពេញលេញរបស់ខ្ញុំ",
        "Upload": "បង្ហោះ",
        "Start with your profile": "ចាប់ផ្តើមពីប្រវត្តិរូបរបស់អ្នក",
        "University": "សាកលវិទ្យាល័យ",
        "Major": "មុខជំនាញ",
        "Career Interests": "ចំណាប់អារម្មណ៍អាជីព",
        "Leadership & Activities": "ភាពជាអ្នកដឹកនាំ និងសកម្មភាព",
        "Certifications & Achievements": "វិញ្ញាបនបត្រ និងសមិទ្ធផល",
        "Certificate name — Issuer (optional)": "ឈ្មោះវិញ្ញាបនបត្រ — អ្នកចេញ (ជាជម្រើស)",
        "You can type certificates or upload certificate images/PDFs in Smart AI above.": "អ្នកអាចវាយបញ្ចូលវិញ្ញាបនបត្រ ឬបង្ហោះរូបភាព/PDF នៅក្នុង Smart AI ខាងលើ។",
        "Add as many languages as you need and choose a proficiency level for each.": "បន្ថែមភាសាតាមតម្រូវការ ហើយជ្រើសរើសកម្រិតសមត្ថភាពសម្រាប់ភាសានីមួយៗ។",
        "Save Draft": "រក្សាទុកសេចក្តីព្រាង",
        "Optional profile photo appears in templates that support it.": "រូបថតប្រវត្តិរូបជាជម្រើសនឹងបង្ហាញក្នុងគំរូដែលគាំទ្រ។",
        "CONTACT": "ទំនាក់ទំនង",
        "Search career guides...": "ស្វែងរកមគ្គុទ្ទេសក៍អាជីព...",
        "Total Guides": "មគ្គុទ្ទេសក៍សរុប",
        "Published": "បានផ្សព្វផ្សាយ",
        "Categories": "ប្រភេទ",
        "Career Guide": "មគ្គុទ្ទេសក៍អាជីព",
        "Career Path": "ផ្លូវអាជីព",
        "Created": "បានបង្កើត",
        "Add Career Guide": "បន្ថែមមគ្គុទ្ទេសក៍អាជីព",
        "Create or update a career guide.": "បង្កើត ឬធ្វើបច្ចុប្បន្នភាពមគ្គុទ្ទេសក៍អាជីព។",
        "Title *": "ចំណងជើង *",
        "Qualifications": "លក្ខណៈសម្បត្តិ",
        "Related Internships": "កម្មសិក្សាពាក់ព័ន្ធ",
        "Guide Content": "ខ្លឹមសារមគ្គុទ្ទេសក៍",
        "Save Career Guide": "រក្សាទុកមគ្គុទ្ទេសក៍អាជីព",
        "Manage career guidance and learning resources.": "គ្រប់គ្រងការណែនាំអាជីព និងធនធានសិក្សា។",
        "Administrators": "អ្នកគ្រប់គ្រង",
        "Displayed Users": "អ្នកប្រើប្រាស់ដែលបង្ហាញ",
        "Search by name...": "ស្វែងរកតាមឈ្មោះ...",
        "Newest": "ថ្មីបំផុត",
        "Oldest": "ចាស់បំផុត",
        "Name A-Z": "ឈ្មោះ A-Z",
        "User": "អ្នកប្រើប្រាស់",
        "Role": "តួនាទី",
        "Joined": "បានចូលរួម",
        "User profile": "ប្រវត្តិរូបអ្នកប្រើប្រាស់",
        "User details": "ព័ត៌មានអ្នកប្រើប្រាស់",
        "Contact & education": "ទំនាក់ទំនង និងការអប់រំ",
        "Career profile": "ប្រវត្តិរូបអាជីព",
        "Career roles": "តួនាទីអាជីព",
        "Preferred industry": "ឧស្សាហកម្មដែលចូលចិត្ត",
        "Internship type": "ប្រភេទកម្មសិក្សា",
        "Not provided": "មិនបានផ្តល់",
        "No bio provided.": "មិនបានផ្តល់ប្រវត្តិរូបសង្ខេបទេ។",
        "All Users": "អ្នកប្រើប្រាស់ទាំងអស់",
        "Close user profile": "បិទប្រវត្តិរូបអ្នកប្រើប្រាស់",
        "Student & Early Talent Portal": "វេទិកាសម្រាប់និស្សិត និងអ្នកមានទេពកោសល្យដំបូង",
        "Platform Status: Active": "ស្ថានភាពវេទិកា៖ ដំណើរការ",
        "Build your future, one opportunity at a time.": "កសាងអនាគតរបស់អ្នក តាមរយៈឱកាសនីមួយៗ។",
        "Find internships, explore career paths, and prepare for your next step with one student-friendly platform.": "ស្វែងរកកម្មសិក្សា ស្វែងយល់ពីផ្លូវអាជីព និងត្រៀមជំហានបន្ទាប់របស់អ្នកនៅលើវេទិកាដែលងាយស្រួលសម្រាប់និស្សិត។",
        "Enter your password": "បញ្ចូលពាក្យសម្ងាត់របស់អ្នក",
        "Show password": "បង្ហាញពាក្យសម្ងាត់",
        "© 2026 InternGuide. Find Opportunities. Build Your Future.": "© ២០២៦ InternGuide។ ស្វែងរកឱកាស។ កសាងអនាគតរបស់អ្នក។",
        "Discover": "ស្វែងយល់",
        "Explore": "រុករក",
        "Prepare": "ត្រៀមខ្លួន",
        "Apply": "ដាក់ពាក្យ",
        "Investigate requirements, expectations, and growth avenues to make well-informed career choices.": "សិក្សាលក្ខខណ្ឌ ការរំពឹងទុក និងឱកាសរីកចម្រើន ដើម្បីជ្រើសរើសអាជីពដោយមានព័ត៌មានគ្រប់គ្រាន់។",
        "Optimize your CV layout, practice mock behavioral prompts, and close targeted technical skill gaps.": "កែលម្អប្លង់ CV ហាត់ឆ្លើយសំណួរអាកប្បកិរិយាសាកល្បង និងបំពេញចន្លោះជំនាញបច្ចេកទេសដែលត្រូវការ។",
        "Submit applications confidently with verified portfolio materials and targeted interview responses.": "ដាក់ពាក្យដោយមានទំនុកចិត្ត ជាមួយសំណុំស្នាដៃដែលបានផ្ទៀងផ្ទាត់ និងចម្លើយសម្ភាសន៍សមស្រប។",
        "EXPLORE PLATFORM MODULES": "ស្វែងយល់ពីផ្នែកនានានៃវេទិកា",
        "What You Can Find on InternGuide": "អ្វីៗដែលអ្នកអាចរកបាននៅលើ InternGuide",
        "Explore Careers": "ស្វែងរកអាជីព",
        "Prepare Now": "ត្រៀមខ្លួនឥឡូវនេះ",
        "Skills Guide": "មគ្គុទ្ទេសក៍ជំនាញ",
        "View Skills": "មើលជំនាញ",
        "COMMUNICATION": "ការទំនាក់ទំនង",
        "Home | InternGuide": "ទំព័រដើម | InternGuide",
        "Log In | InternGuide": "ចូលគណនី | InternGuide",
        "GAIN": "ទទួលបាន",
        "Real Experience": "បទពិសោធន៍ជាក់ស្តែង",
        "BUILD": "កសាង",
        "Your Network": "បណ្តាញទំនាក់ទំនងរបស់អ្នក",
        "A BRIGHTER": "កាន់តែភ្លឺស្វាង",
        "Future Awaits": "អនាគតកំពុងរង់ចាំ",
        "Read Guide →": "អានមគ្គុទ្ទេសក៍ →",
        "View All Testimonials →": "មើលមតិទាំងអស់ →",
        "Explore Internships →": "ស្វែងរកកម្មសិក្សា →",
        "“InternGuide helped me find the perfect internship and gave me the confidence to apply!”": "“InternGuide បានជួយខ្ញុំស្វែងរកកម្មសិក្សាដែលសមស្រប និងផ្តល់ទំនុកចិត្តឱ្យខ្ញុំដាក់ពាក្យ!”",
        "“The career guides and interview tips are super useful. Highly recommended!”": "“មគ្គុទ្ទេសក៍អាជីព និងគន្លឹះសម្ភាសន៍មានប្រយោជន៍ខ្លាំងណាស់។ ខ្ញុំសូមណែនាំ!”",
        "“A one-stop platform for everything I need for my career journey.”": "“វេទិកាតែមួយដែលមានអ្វីៗគ្រប់យ៉ាងដែលខ្ញុំត្រូវការសម្រាប់ដំណើរអាជីព។”",
        "Students walking together": "សិស្សដើរជាមួយគ្នា",
        "Profile picture": "រូបភាពប្រវត្តិរូប",
        "Change profile picture": "ប្តូររូបភាពប្រវត្តិរូប",
        "Toggle menu": "បើក/បិទម៉ឺនុយ",
        "Purpose & Value": "គោលបំណង និងតម្លៃ",
        "Starting an internship search or choosing a career path can be challenging when key insights, deadlines, and skill expectations are scattered across disjointed sites.": "ការស្វែងរកកម្មសិក្សា ឬជ្រើសរើសផ្លូវអាជីពអាចពិបាក នៅពេលព័ត៌មានសំខាន់ៗ កាលកំណត់ និងជំនាញដែលត្រូវការត្រូវបានបែកខ្ញែកនៅលើគេហទំព័រផ្សេងៗ។",
        "12,000+": "១២,០០០+",
        "850+": "៨៥០+",
        "96%": "៩៦%",
        "Why InternGuide?": "ហេតុអ្វី InternGuide?",
        "Find Opportunities": "ស្វែងរកឱកាស",
        "Discover internship positions that match your specific passions, academic field, and career trajectories.": "ស្វែងរកមុខតំណែងកម្មសិក្សាដែលត្រូវនឹងចំណង់ចំណូលចិត្ត មុខជំនាញសិក្សា និងផ្លូវអាជីពរបស់អ្នក។",
        "Filter by role": "ត្រងតាមតួនាទី",
        "Learn about emerging industries, real-world day-to-day responsibilities, and long-term career growth.": "ស្វែងយល់អំពីវិស័យកំពុងរីកចម្រើន ភារកិច្ចប្រចាំថ្ងៃជាក់ស្តែង និងការរីកចម្រើនអាជីពរយៈពេលវែង។",
        "Browse 40+ paths": "រកមើលផ្លូវអាជីពជាង ៤០",
        "Get battle-tested advice for tailoring CVs, building portfolio showcases, and answering tough interview prompts.": "ទទួលដំបូន្មានជាក់ស្តែងសម្រាប់កែសម្រួល CV បង្កើតសំណុំស្នាដៃ និងឆ្លើយសំណួរសម្ភាសន៍ពិបាកៗ។",
        "ATS-ready guides": "មគ្គុទ្ទេសក៍ត្រៀមសម្រាប់ ATS",
        "Master the essential hard and soft proficiencies demanded by top companies hiring entry-level talent today.": "ពង្រឹងជំនាញបច្ចេកទេស និងជំនាញទន់សំខាន់ៗដែលក្រុមហ៊ុនឈានមុខត្រូវការពីបុគ្គលិកកម្រិតដំបូង។",
        "Our mission is to make career and internship preparation easier and equitable for all students by providing verified, actionable information through one clear, structured platform.": "បេសកកម្មរបស់យើងគឺធ្វើឱ្យការត្រៀមខ្លួនសម្រាប់អាជីព និងកម្មសិក្សាកាន់តែងាយស្រួល និងស្មើភាពសម្រាប់សិស្សទាំងអស់ តាមរយៈព័ត៌មានដែលបានផ្ទៀងផ្ទាត់ និងអាចអនុវត្តបាននៅលើវេទិកាច្បាស់លាស់មួយ។",
        "InternGuide bridges the critical gap between university lecture halls and day-one workplace readiness, helping students transition smoothly from passive searchers to confident applicants.": "InternGuide ជួយបំពេញគម្លាតរវាងការសិក្សានៅសាកលវិទ្យាល័យ និងការត្រៀមខ្លួនសម្រាប់ថ្ងៃដំបូងនៅកន្លែងធ្វើការ ដោយជួយសិស្សឱ្យក្លាយពីអ្នកស្វែងរកអកម្មទៅជាបេក្ខជនដែលមានទំនុកចិត្ត។",
        "Every student deserves direct access to the tools, mentorship frameworks, and transparent role expectations that launch meaningful careers.": "សិស្សគ្រប់រូបគួរតែទទួលបានឧបករណ៍ ការណែនាំ និងការរំពឹងទុកច្បាស់លាស់ចំពោះតួនាទីការងារ ដើម្បីចាប់ផ្តើមអាជីពដែលមានន័យ។",
        "Identify relevant roles & programs": "កំណត់តួនាទី និងកម្មវិធីដែលពាក់ព័ន្ធ",
        "Examine prerequisites & industry pathways": "ពិនិត្យលក្ខខណ្ឌ និងផ្លូវក្នុងវិស័យ",
        "Refine portfolios, resume & technique": "កែលម្អសំណុំស្នាដៃ ប្រវត្តិរូប និងបច្ចេកទេស",
        "Submit with complete preparedness": "ដាក់ពាក្យដោយបានត្រៀមខ្លួនរួចរាល់",
        "Milestone tracker included with student accounts": "មានឧបករណ៍តាមដានជំហានសំខាន់ៗក្នុងគណនីសិស្ស",
        "100% Free for University Students": "ឥតគិតថ្លៃ ១០០% សម្រាប់និស្សិតសាកលវិទ្យាល័យ",
        "Everything students need is organized into four intuitive, structured phases.": "អ្វីៗដែលសិស្សត្រូវការត្រូវបានរៀបចំជាបួនដំណាក់កាលងាយយល់ និងមានរចនាសម្ព័ន្ធ។",
        "Search and filter real internship postings across tech, business, engineering, and creative disciplines.": "ស្វែងរក និងត្រងប្រកាសកម្មសិក្សាពិតក្នុងវិស័យបច្ចេកវិទ្យា ពាណិជ្ជកម្ម វិស្វកម្ម និងច្នៃប្រឌិត។",
        "A modular suite of student-centered tools crafted to guide you through every milestone of your internship search.": "សំណុំឧបករណ៍សម្រាប់សិស្សដែលត្រូវបានរៀបចំ ដើម្បីណែនាំអ្នកគ្រប់ជំហាននៃការស្វែងរកកម្មសិក្សា។",
        "Explore active, verified positions with stipend clarity, duration periods, and direct apply deadlines.": "ស្វែងរកមុខតំណែងសកម្មដែលបានផ្ទៀងផ្ទាត់ ព័ត៌មានប្រាក់ឧបត្ថម្ភ រយៈពេល និងកាលកំណត់ដាក់ពាក្យច្បាស់លាស់។",
        "Examine detailed sector roadmaps, average starting packages, and expected day-to-day deliverables.": "ពិនិត្យផែនទីវិស័យលម្អិត ប្រាក់បៀវត្សចាប់ផ្តើមជាមធ្យម និងការងារប្រចាំថ្ងៃដែលរំពឹងទុក។",
        "Access field-tested resume templates, STAR method answering frameworks, and interview prep rubrics.": "ប្រើគំរូ CV ដែលបានសាកល្បង វិធីរៀបចំចម្លើយ STAR និងក្របខណ្ឌត្រៀមសម្ភាសន៍។",
        "Understand the core technical stack requirements and team soft skills essential for entry success.": "យល់ដឹងពីជំនាញបច្ចេកទេសសំខាន់ៗ និងជំនាញទន់សម្រាប់ការចាប់ផ្តើមការងារជាក្រុម។",
        "Have questions, feedback, or need guidance using the platform? Send our student counseling & support team a direct note.": "មានសំណួរ មតិកែលម្អ ឬត្រូវការការណែនាំក្នុងការប្រើវេទិកាមែនទេ? ផ្ញើសារទៅក្រុមប្រឹក្សា និងជំនួយសិស្សរបស់យើង។",
        "Email our support desk": "អ៊ីមែលទៅកាន់ផ្នែកជំនួយ",
        "Regional Headquarters": "ទីស្នាក់ការកណ្តាលប្រចាំតំបន់",
        "Connect with our student communities": "ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍សិស្សរបស់យើង",
        "Fill out the form below and an advisor will respond within 24 hours.": "បំពេញទម្រង់ខាងក្រោម ហើយអ្នកប្រឹក្សានឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។",
        "Quick answers to common questions about using InternGuide.": "ចម្លើយរហ័សចំពោះសំណួរទូទៅអំពីការប្រើ InternGuide។",
        "Explore vetted opportunities, discover tailored career paths, and prepare for your next professional milestone with InternGuide.": "ស្វែងរកឱកាសដែលបានផ្ទៀងផ្ទាត់ ស្វែងយល់ពីផ្លូវអាជីពសមស្រប និងត្រៀមខ្លួនសម្រាប់ជំហានវិជ្ជាជីវៈបន្ទាប់ជាមួយ InternGuide។",
        "Write one short paragraph about yourself, your studies, projects, skills, goals, and experience. Smart AI will organize it into a clean one-page CV using your InternGuide profile.": "សរសេរកថាខណ្ឌខ្លីមួយអំពីខ្លួន ការសិក្សា គម្រោង ជំនាញ គោលដៅ និងបទពិសោធន៍របស់អ្នក។ Smart AI នឹងរៀបចំវាជា CV មួយទំព័រដោយប្រើប្រវត្តិរូប InternGuide របស់អ្នក។",
        "Upload certificate images or PDFs. Smart AI can use them when building the Certificates section.": "បង្ហោះរូបភាព ឬ PDF នៃវិញ្ញាបនបត្រ។ Smart AI អាចប្រើវានៅពេលបង្កើតផ្នែកវិញ្ញាបនបត្រ។",
        "Optional profile photo appears in templates that support it.": "រូបថតប្រវត្តិរូបជាជម្រើសនឹងបង្ហាញក្នុងគំរូដែលគាំទ្រ។",
        "Reference name — role or organization — contact details": "ឈ្មោះអ្នកយោង — តួនាទី ឬស្ថាប័ន — ព័ត៌មានទំនាក់ទំនង",
        "University — Major\n2024–2027": "សាកលវិទ្យាល័យ — មុខជំនាញ\n២០២៤–២០២៧",
        "Save Draft": "រក្សាទុកសេចក្តីព្រាង",
        "Live CV Preview": "មើល CV ផ្ទាល់",
        "A4-style preview": "ទម្រង់មើលជាមុន A4",
        "Add Career Guide": "បន្ថែមមគ្គុទ្ទេសក៍អាជីព",
        "Search career guides...": "ស្វែងរកមគ្គុទ្ទេសក៍អាជីព...",
        "All Status": "ស្ថានភាពទាំងអស់",
        "All Categories": "ប្រភេទទាំងអស់",
        "Total Guides": "មគ្គុទ្ទេសក៍សរុប",
        "Manage career guidance and learning resources.": "គ្រប់គ្រងការណែនាំអាជីព និងធនធានសិក្សា។",
        "Manage InternGuide students and administrators.": "គ្រប់គ្រងសិស្ស និងអ្នកគ្រប់គ្រង InternGuide។",
        "Search by name...": "ស្វែងរកតាមឈ្មោះ...",
        "Search title, company, category...": "ស្វែងរកចំណងជើង ក្រុមហ៊ុន ឬប្រភេទ...",
        "Name A-Z": "ឈ្មោះ A-Z",
        "Not provided": "មិនបានផ្តល់",
        "Contact & education": "ទំនាក់ទំនង និងការអប់រំ",
        "Career profile": "ប្រវត្តិរូបអាជីព",
        "Education": "ការអប់រំ",
        "Experience": "បទពិសោធន៍",
        "STEP 1 • RESEARCH": "ជំហានទី ១ • ស្រាវជ្រាវ",
        "STEP 2 • PRACTICE": "ជំហានទី ២ • ហាត់អនុវត្ត",
        "STEP 3 • STRUCTURE": "ជំហានទី ៣ • រៀបចំចម្លើយ",
        "STEP 4 • ENGAGE": "ជំហានទី ៤ • ចូលរួម",
        "What do you hope to learn from this internship?": "តើអ្នកសង្ឃឹមថានឹងរៀនអ្វីពីកម្មសិក្សានេះ?",
        "Do you have any questions for us?": "តើអ្នកមានសំណួរអ្វីសម្រាប់ពួកយើងទេ?",
        "Simple Tips for a Better Interview": "គន្លឹះងាយៗសម្រាប់សម្ភាសន៍កាន់តែល្អ",
        "Research the Company": "ស្រាវជ្រាវអំពីក្រុមហ៊ុន",
        "Review Job Description": "ពិនិត្យការពិពណ៌នាការងារ",
        "Practice Your Answers": "ហាត់ឆ្លើយសំណួរ",
        "Dress Appropriately": "ស្លៀកពាក់ឱ្យសមរម្យ",
        "Arrive on Time": "មកដល់ទាន់ពេល",
        "Don't Have Much Experience Yet?": "មិនទាន់មានបទពិសោធន៍ច្រើនមែនទេ?",
        "That's okay. Your university projects, coursework, volunteer activities, clubs, and personal projects can help demonstrate your skills.": "មិនអីទេ។ គម្រោងសាកលវិទ្យាល័យ កិច្ចការសិក្សា សកម្មភាពស្ម័គ្រចិត្ត ក្លឹប និងគម្រោងផ្ទាល់ខ្លួនអាចជួយបង្ហាញជំនាញរបស់អ្នកបាន។",
        "University Projects": "គម្រោងសាកលវិទ្យាល័យ",
        "Class deliverables, capstones, and lab reports demonstrate problem formulation, teamwork, execution, and presentation skills.": "កិច្ចការថ្នាក់ គម្រោងបញ្ចប់ការសិក្សា និងរបាយការណ៍មន្ទីរពិសោធន៍បង្ហាញពីសមត្ថភាពកំណត់បញ្ហា ធ្វើការជាក្រុម អនុវត្ត និងធ្វើបទបង្ហាញ។",
        "Include tech stack & your role": "បញ្ចូលបច្ចេកវិទ្យាដែលប្រើ និងតួនាទីរបស់អ្នក",
        "Coursework": "កិច្ចការសិក្សា",
        "Specialized upper-division subjects, lab modules, and academic focus areas prove baseline domain knowledge to recruiters.": "មុខវិជ្ជាជំនាញ កិច្ចការមន្ទីរពិសោធន៍ និងផ្នែកសិក្សាដែលអ្នកផ្តោតបង្ហាញចំណេះដឹងមូលដ្ឋានដល់អ្នកជ្រើសរើសបុគ្គលិក។",
        "List 4-6 most relevant modules": "រាយមុខវិជ្ជាពាក់ព័ន្ធបំផុត ៤-៦ មុខ",
        "Volunteer Experience": "បទពិសោធន៍ស្ម័គ្រចិត្ត",
        "Community outreach, campus societies, event organization, and student leadership show character, initiative, and responsibility.": "សកម្មភាពសហគមន៍ សមាគមសាកលវិទ្យាល័យ ការរៀបចំព្រឹត្តិការណ៍ និងភាពជាអ្នកដឹកនាំបង្ហាញពីចរិត គំនិតផ្តួចផ្តើម និងការទទួលខុសត្រូវ។",
        "Focus on leadership & coordination": "ផ្តោតលើភាពជាអ្នកដឹកនាំ និងការសម្របសម្រួល",
        "Personal Projects": "គម្រោងផ្ទាល់ខ្លួន",
        "Independent coding applications, design portfolios, research essays, or case studies demonstrate genuine intrinsic motivation.": "កម្មវិធីដែលសរសេរកូដដោយខ្លួនឯង សំណុំស្នាដៃរចនា អត្ថបទស្រាវជ្រាវ ឬករណីសិក្សាបង្ហាញពីការជំរុញចិត្តពិតប្រាកដ។",
        "Provide working links / demos": "ផ្តល់តំណភ្ជាប់ ឬការបង្ហាញដែលអាចប្រើបាន",
        "Ready to Take the Next Step?": "ត្រៀមចាប់យកជំហានបន្ទាប់ហើយឬនៅ?",
        "Create your CV, prepare for interviews, and start applying for internship opportunities today.": "បង្កើត CV ត្រៀមសម្ភាសន៍ និងចាប់ផ្តើមដាក់ពាក្យកម្មសិក្សានៅថ្ងៃនេះ។",
        "Find Internships": "ស្វែងរកកម្មសិក្សា",
        "B.S. in Computer Science • GPA: 3.82/4.0": "បរិញ្ញាបត្រវិទ្យាសាស្ត្រកុំព្យូទ័រ • GPA៖ ៣.៨២/៤.០",
        "Built automated course calendar with 1,200 active campus users.": "បានបង្កើតប្រតិទិនមុខវិជ្ជាស្វ័យប្រវត្តិដែលមានអ្នកប្រើប្រាស់សកម្ម ១,២០០ នាក់ក្នុងសាកលវិទ្យាល័យ។",
        "Peer Tutor • Association for Computing Machinery (ACM)": "គ្រូបង្រៀនជំនួយ • សមាគមម៉ាស៊ីនគណនា (ACM)",
        "Popular Career Paths": "ផ្លូវអាជីពពេញនិយម",
        "ABOUT INTERNGUIDE": "អំពី INTERNGUIDE",
        "KEY SKILLS": "ជំនាញសំខាន់ៗ",
        "Phnom Penh": "ភ្នំពេញ",
        "Phnom Penh, Cambodia": "ភ្នំពេញ ប្រទេសកម្ពុជា",
        "Enter your full name": "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
        "Create a password": "បង្កើតពាក្យសម្ងាត់",
        "Hide password": "លាក់ពាក្យសម្ងាត់",
        "Login failed. Please try again.": "ការចូលគណនីបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
        "Sign up failed. Please try again.": "ការបង្កើតគណនីបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
        "Please enter your email and password.": "សូមបញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក។",
        "Please enter your phone number.": "សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នក។",
        "Please enter the 6-digit verification code.": "សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់ ៦ ខ្ទង់។",
        "Verification code sent to your phone.": "លេខកូដផ្ទៀងផ្ទាត់ត្រូវបានផ្ញើទៅទូរស័ព្ទរបស់អ្នក។",
        "Could not send verification code.": "មិនអាចផ្ញើលេខកូដផ្ទៀងផ្ទាត់បានទេ។",
        "Google login failed.": "ការចូលគណនីតាម Google បរាជ័យ។",
        "Login successful! Redirecting...": "ចូលគណនីបានជោគជ័យ! កំពុងបញ្ជូនទៅទំព័របន្ទាប់...",
        "Please fill in all fields.": "សូមបំពេញគ្រប់ប្រអប់។",
        "Password must be at least 8 characters.": "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ។",
        "Please enter your full name.": "សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។",
        "Please enter your email.": "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។",
        "Passwords do not match.": "ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។",
        "Please agree to the Terms of Service and Privacy Policy.": "សូមយល់ព្រមតាមលក្ខខណ្ឌសេវាកម្ម និងគោលការណ៍ឯកជនភាព។",
        "Creating account...": "កំពុងបង្កើតគណនី...",
        "Account created successfully! Redirecting...": "បង្កើតគណនីបានជោគជ័យ! កំពុងបញ្ជូនទៅទំព័របន្ទាប់...",
        "Account created! Please check your email to confirm your account.": "បានបង្កើតគណនីហើយ! សូមពិនិត្យអ៊ីមែលដើម្បីបញ្ជាក់គណនី។",
        "Verification failed. Please try again.": "ការផ្ទៀងផ្ទាត់បរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
        "Log In to InternGuide": "ចូលទៅកាន់ InternGuide",
        "Create My InternGuide Account": "បង្កើតគណនី InternGuide របស់ខ្ញុំ",
        "Business Analyst": "អ្នកវិភាគអាជីវកម្ម",
        "Business Analysts study business needs and processes, identify problems, gather requirements, and help teams develop effective solutions.": "អ្នកវិភាគអាជីវកម្មសិក្សាតម្រូវការ និងដំណើរការអាជីវកម្ម កំណត់បញ្ហា ប្រមូលលក្ខខណ្ឌតម្រូវ និងជួយក្រុមបង្កើតដំណោះស្រាយប្រកបដោយប្រសិទ្ធភាព។",
        "Cybersecurity Analyst": "អ្នកវិភាគសន្តិសុខសាយប័រ",
        "Cybersecurity Analysts help organizations protect systems, networks, applications, and information from security threats. They monitor security events, investigate incidents, and help improve security practices.": "អ្នកវិភាគសន្តិសុខសាយប័រជួយស្ថាប័នការពារប្រព័ន្ធ បណ្តាញ កម្មវិធី និងព័ត៌មានពីការគំរាមកំហែងផ្នែកសុវត្ថិភាព។ ពួកគេតាមដានព្រឹត្តិការណ៍សុវត្ថិភាព ស៊ើបអង្កេតឧប្បត្តិហេតុ និងជួយកែលម្អការអនុវត្តសុវត្ថិភាព។",
        "Digital Marketing Specialist": "អ្នកជំនាញទីផ្សារឌីជីថល",
        "Digital Marketing Specialists help organizations promote products, services, and brands through digital channels such as search engines, websites, social media, and email.": "អ្នកជំនាញទីផ្សារឌីជីថលជួយស្ថាប័នផ្សព្វផ្សាយផលិតផល សេវាកម្ម និងម៉ាកតាមបណ្តាញឌីជីថល ដូចជាម៉ាស៊ីនស្វែងរក គេហទំព័រ បណ្តាញសង្គម និងអ៊ីមែល។",
        "Data Analyst": "អ្នកវិភាគទិន្នន័យ",
        "Data Analysts collect, clean, analyze, and visualize data to help organizations understand problems and make informed decisions.": "អ្នកវិភាគទិន្នន័យប្រមូល សម្អាត វិភាគ និងបង្ហាញទិន្នន័យ ដើម្បីជួយស្ថាប័នយល់ពីបញ្ហា និងធ្វើការសម្រេចចិត្តដោយមានព័ត៌មានគ្រប់គ្រាន់។",
        "UI/UX Designer": "អ្នករចនា UI/UX",
        "UI/UX Designers create digital interfaces and experiences that are useful, accessible, and easy to use. They research user needs, design interfaces, create prototypes, and work with developers to improve digital products.": "អ្នករចនា UI/UX បង្កើតចំណុចប្រទាក់ និងបទពិសោធន៍ឌីជីថលដែលមានប្រយោជន៍ ងាយស្រួលប្រើ និងអាចចូលប្រើបាន។ ពួកគេស្រាវជ្រាវតម្រូវការអ្នកប្រើប្រាស់ រចនាចំណុចប្រទាក់ បង្កើតគំរូសាកល្បង និងធ្វើការជាមួយអ្នកអភិវឌ្ឍន៍ដើម្បីកែលម្អផលិតផលឌីជីថល។",
        "Software Engineer": "វិស្វករកម្មវិធី",
        "Software Engineers design, develop, test, and maintain software applications and systems. They work with programming languages, databases, APIs, and development tools to build reliable digital products.": "វិស្វករកម្មវិធីរចនា អភិវឌ្ឍ សាកល្បង និងថែទាំកម្មវិធី និងប្រព័ន្ធ។ ពួកគេប្រើភាសាសរសេរកម្មវិធី មូលដ្ឋានទិន្នន័យ API និងឧបករណ៍អភិវឌ្ឍន៍ ដើម្បីបង្កើតផលិតផលឌីជីថលដែលអាចទុកចិត្តបាន។",
        "Marketing Intern": "អ្នកហាត់ការផ្នែកទីផ្សារ",
        "Assist with marketing campaigns, content planning, and market research.": "ជួយរៀបចំយុទ្ធនាការទីផ្សារ ផែនការមាតិកា និងការស្រាវជ្រាវទីផ្សារ។",
        "Network Engineering Intern": "អ្នកហាត់ការផ្នែកវិស្វកម្មបណ្តាញ",
        "Assist with network infrastructure, troubleshooting, and technical support.": "ជួយលើហេដ្ឋារចនាសម្ព័ន្ធបណ្តាញ ការដោះស្រាយបញ្ហា និងជំនួយបច្ចេកទេស។",
        "Business Analyst Intern": "អ្នកហាត់ការផ្នែកវិភាគអាជីវកម្ម",
        "Assist with business research, reporting, and data-driven analysis.": "ជួយស្រាវជ្រាវអាជីវកម្ម រៀបចំរបាយការណ៍ និងវិភាគដោយផ្អែកលើទិន្នន័យ។",
        "UI/UX Design Intern": "អ្នកហាត់ការផ្នែករចនា UI/UX",
        "Support user interface design, user research, and design improvements.": "ជួយរចនាចំណុចប្រទាក់អ្នកប្រើ ស្រាវជ្រាវអ្នកប្រើប្រាស់ និងកែលម្អការរចនា។",
        "Data Analytics Intern": "អ្នកហាត់ការផ្នែកវិភាគទិន្នន័យ",
        "Assist with data analysis, dashboards, and business insights.": "ជួយវិភាគទិន្នន័យ បង្កើតផ្ទាំងគ្រប់គ្រង និងស្វែងរកព័ត៌មានសំខាន់ៗសម្រាប់អាជីវកម្ម។",
        "Data Analyst Intern": "អ្នកហាត់ការផ្នែកវិភាគទិន្នន័យ",
        "Assist with data analysis and business reporting.": "ជួយវិភាគទិន្នន័យ និងរៀបចំរបាយការណ៍អាជីវកម្ម។",
        "Software Engineering Intern": "អ្នកហាត់ការផ្នែកវិស្វកម្មកម្មវិធី",
        "Work with software engineers on development projects.": "ធ្វើការជាមួយវិស្វករកម្មវិធីលើគម្រោងអភិវឌ្ឍន៍។",
        "Product Design Intern": "អ្នកហាត់ការផ្នែករចនាផលិតផល",
        "Support product design and user experience activities.": "ជួយលើការរចនាផលិតផល និងសកម្មភាពកែលម្អបទពិសោធន៍អ្នកប្រើប្រាស់។",
        "Business Analysis": "ការវិភាគអាជីវកម្ម",
        "Communication": "ការទំនាក់ទំនង",
        "Problem Solving": "ការដោះស្រាយបញ្ហា",
        "Requirements Gathering": "ការប្រមូលលក្ខខណ្ឌតម្រូវ",
        "Data Analysis": "ការវិភាគទិន្នន័យ",
        "Documentation": "ការរៀបចំឯកសារ",
        "Networking": "បណ្តាញកុំព្យូទ័រ",
        "Technical Support": "ជំនួយបច្ចេកទេស",
        "Cybersecurity Fundamentals": "មូលដ្ឋានសន្តិសុខសាយប័រ",
        "Risk Assessment": "ការវាយតម្លៃហានិភ័យ",
        "Security Monitoring": "ការតាមដានសុវត្ថិភាព",
        "Social Media Marketing": "ទីផ្សារតាមបណ្តាញសង្គម",
        "Content Creation": "ការបង្កើតមាតិកា",
        "Google Analytics": "Google Analytics",
        "Email Marketing": "ទីផ្សារតាមអ៊ីមែល",
        "Copywriting": "ការសរសេរអត្ថបទផ្សព្វផ្សាយ",
        "Data Visualization": "ការបង្ហាញទិន្នន័យជារូបភាព",
        "Analytical Thinking": "ការគិតបែបវិភាគ",
        "UI Design": "ការរចនា UI",
        "UX Research": "ការស្រាវជ្រាវ UX",
        "Wireframing": "ការបង្កើតគ្រោងរចនា",
        "Prototyping": "ការបង្កើតគំរូសាកល្បង",
        "User Testing": "ការសាកល្បងជាមួយអ្នកប្រើប្រាស់",
        "Design Systems": "ប្រព័ន្ធរចនា",
        "Data Structures": "រចនាសម្ព័ន្ធទិន្នន័យ",
        "Algorithms": "ក្បួនដោះស្រាយ",
        "Programming": "ការសរសេរកម្មវិធី",
        "Excel": "Excel",
        "SQL": "SQL",
        "Linux": "Linux",
        "Python": "Python",
        "Java": "Java",
        "JavaScript": "JavaScript",
        "Git": "Git",
        "Figma": "Figma",
        "Statistics": "ស្ថិតិ",
        "Power BI": "Power BI",
        "Tableau": "Tableau",
        "No career guides match your search.": "រកមិនឃើញមគ្គុទ្ទេសក៍អាជីពដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
        "No career guides have been published yet.": "មិនទាន់មានមគ្គុទ្ទេសក៍អាជីពត្រូវបានផ្សព្វផ្សាយទេ។",
        "Career guides could not be loaded. Please try again later.": "មិនអាចផ្ទុកមគ្គុទ្ទេសក៍អាជីពបានទេ។ សូមព្យាយាមម្តងទៀតពេលក្រោយ។",
        "More information about this career will be added soon.": "ព័ត៌មានបន្ថែមអំពីអាជីពនេះនឹងត្រូវបានបន្ថែមក្នុងពេលឆាប់ៗនេះ។",
        "Qualifications": "លក្ខណៈសម្បត្តិ",
        "Guide": "មគ្គុទ្ទេសក៍",
        "State Tech University": "សាកលវិទ្យាល័យ State Tech",
        "Seattle, WA": "ទីក្រុង Seattle រដ្ឋ Washington",
        "Written articulation, pitch presentations, stakeholder briefing": "ការប្រាស្រ័យទាក់ទងជាលាយលក្ខណ៍អក្សរ ការធ្វើបទបង្ហាញ និងការជូនដំណឹងដល់អ្នកពាក់ព័ន្ធ",
        "Cross-functional collaboration, empathy, inclusive mindset": "ការសហការរវាងក្រុម ការយល់ចិត្ត និងផ្នត់គំនិតរួមបញ្ចូល",
        "Structured root-cause diagnosis, lateral critical thinking": "ការស្វែងរកមូលហេតុឫសគល់តាមប្រព័ន្ធ និងការគិតវិភាគទូលំទូលាយ",
        "Sprint planning, priority mapping, agile work delivery": "ការរៀបចំផែនការ Sprint កំណត់អាទិភាព និងការងារបែប Agile"
    };

    const originalTextNodes = new WeakMap();
    const originalAttributes = new WeakMap();
    let translationObserver;
    const originalDocumentTitle = document.title;
    const STORAGE_KEY = "internGuideLanguage";
    const DEFAULT_LANGUAGE = "en";

    function getLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === "km" ? "km" : DEFAULT_LANGUAGE;
        } catch (error) {
            return DEFAULT_LANGUAGE;
        }
    }

    function setLanguage(language) {
        const normalized = language === "km" ? "km" : DEFAULT_LANGUAGE;
        document.documentElement.lang = normalized;
        document.documentElement.setAttribute("data-language", normalized);
        try {
            localStorage.setItem(STORAGE_KEY, normalized);
        } catch (error) {
            // ignore storage issues
        }
        applyTranslations();
        updateSwitcher();
        window.dispatchEvent(new CustomEvent("internGuideLanguageChange", {
            detail: { language: normalized }
        }));
    }

    function resolveTranslation(language, path) {
        const root = translations[language] || translations[DEFAULT_LANGUAGE];
        const value = path.split(".").reduce((current, segment) => {
            if (current && current[segment] !== undefined) return current[segment];
            return undefined;
        }, root);
        return value ?? path;
    }

    function t(path) {
        const current = getLanguage();
        return resolveTranslation(current, path) || resolveTranslation(DEFAULT_LANGUAGE, path) || path;
    }

    function translateText(language, value) {
        const normalized = value.trim().replace(/\s+/g, " ");
        if (language !== "km") return undefined;
        const translated = textTranslations[normalized];
        if (translated) return translated;

        const duration = normalized.match(/^(\d+)\s+months?$/i);
        if (!duration) return undefined;
        const khmerDigits = duration[1].replace(/\d/g, (digit) => "០១២៣៤៥៦៧៨៩"[Number(digit)]);
        return `${khmerDigits} ខែ`;
    }

    function toEnglishText(value) {
        const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
        if (!normalized) return "";

        const directMatch = Object.keys(textTranslations).find((text) =>
            text.toLocaleLowerCase() === normalized.toLocaleLowerCase()
        );
        if (directMatch) return directMatch;

        const translationMatches = Object.entries(textTranslations)
            .filter(([, translated]) => translated.trim().replace(/\s+/g, " ") === normalized)
            .map(([text]) => text)
            .sort((left, right) => {
                const capitalization = (text) => text === text.toLocaleUpperCase() ? 1 : 0;
                return capitalization(left) - capitalization(right) || left.length - right.length;
            });
        if (translationMatches.length) return translationMatches[0];

        const latinDigits = normalized.replace(/[០-៩]/g, (digit) => "០១២៣៤៥៦៧៨៩".indexOf(digit));
        const duration = latinDigits.match(/^(\d+)\s*(?:ខែ|months?)$/i);
        if (duration) return `${duration[1]} ${Number(duration[1]) === 1 ? "month" : "months"}`;

        return normalized;
    }

    function getLanguageMeta(language) {
        if (language === "km") {
            return { flag: "/assets/flags/cambodia.png", label: "ខ្មែរ" };
        }
        return { flag: "/assets/flags/united-state.png", label: "English" };
    }

    function setFlagImageSource(image, path) {
        const primaryUrl = new URL(path, document.baseURI).href;
        image.onerror = () => {
            if (image.src !== primaryUrl) return;
            image.src = path.replace(/^\/assets\//, "/public/assets/");
        };
        image.src = path;
    }

    function updateSwitcher() {
        const current = getLanguage();
        const currentMeta = getLanguageMeta(current);

        document.querySelectorAll(".language-trigger").forEach((trigger) => {
            const flag = trigger.querySelector(".language-current-flag");
            const label = trigger.querySelector(".language-current-label");
            const chevron = trigger.querySelector(".language-chevron");

            if (flag) {
                setFlagImageSource(flag, currentMeta.flag);
                flag.alt = currentMeta.label;
            }
            if (label) label.textContent = currentMeta.label;
            trigger.setAttribute("aria-label", `Current language: ${currentMeta.label}`);
            trigger.setAttribute("title", currentMeta.label);
            if (chevron) {
                chevron.setAttribute("aria-hidden", "true");
            }
        });

        document.querySelectorAll(".language-option").forEach((button) => {
            const isActive = button.dataset.lang === current;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
            button.setAttribute("tabindex", isActive ? "0" : "-1");
        });
    }

    function ensureLanguageSwitcher() {
        if (document.querySelector(".language-switcher")) {
            return;
        }

        const header = document.querySelector("header");
        if (!header) return;

        const currentMeta = getLanguageMeta(getLanguage());
        const switcher = document.createElement("div");
        switcher.className = "language-switcher";
        switcher.innerHTML = `
            <button type="button" class="language-trigger" aria-label="Current language: ${currentMeta.label}" title="${currentMeta.label}" aria-haspopup="listbox" aria-expanded="false">
                <img class="language-current-flag" src="${currentMeta.flag}" alt="${currentMeta.label}" aria-hidden="true">
                <span class="language-current-label">${currentMeta.label}</span>
                <svg class="language-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5.5 7.5L10 12l4.5-4.5"/>
                </svg>
            </button>
            <div class="language-menu" role="listbox" aria-label="Select language" hidden>
                <button type="button" class="language-option" data-lang="en" role="option" aria-label="English" aria-selected="false" tabindex="0">
                    <img class="language-option-flag" src="/assets/flags/united-state.png" alt="" aria-hidden="true">
                    <span class="language-option-label">English</span>
                </button>
                <button type="button" class="language-option" data-lang="km" role="option" aria-label="ខ្មែរ" aria-selected="false" tabindex="-1">
                    <img class="language-option-flag" src="/assets/flags/cambodia.png" alt="" aria-hidden="true">
                    <span class="language-option-label">ខ្មែរ</span>
                </button>
            </div>
        `;

        switcher.querySelectorAll(".language-current-flag, .language-option-flag").forEach((image) => {
            setFlagImageSource(image, image.getAttribute("src"));
        });

        const authActions = header.querySelector(".site-auth, .header-actions");
        const firstRow = header.querySelector(":scope > div");
        const headerRow = authActions?.parentElement || (firstRow?.classList.contains("flex") ? firstRow : header);
        const authHeaderActions = headerRow.querySelector(".auth-header-actions");
        const authActionGroups = Array.from(headerRow.querySelectorAll(":scope > .site-auth, :scope > .header-actions"));
        if (authHeaderActions) {
            if (!authHeaderActions.contains(switcher)) {
                authHeaderActions.appendChild(switcher);
            }
        } else if (authActionGroups.length) {
            const authControls = document.createElement("div");
            authControls.className = "site-auth-controls";
            headerRow.insertBefore(authControls, authActionGroups[0]);
            authActionGroups.forEach((actions) => authControls.appendChild(actions));
            authControls.appendChild(switcher);

            const mobileWrap = headerRow.querySelector(":scope > .site-mobile-wrap");
            if (mobileWrap) {
                const headerEndControls = document.createElement("div");
                headerEndControls.className = "site-header-end-controls";
                headerRow.insertBefore(headerEndControls, authControls);
                headerEndControls.append(authControls, mobileWrap);
            }
        } else {
            const returnLink = Array.from(headerRow.querySelectorAll(":scope > a")).find((link) => {
                return link.textContent.trim().toLowerCase().includes("back to internguide");
            });
            if (returnLink) {
                const returnControls = document.createElement("div");
                returnControls.className = "site-auth-return-controls";
                headerRow.insertBefore(returnControls, returnLink);
                returnControls.append(returnLink, switcher);
            } else {
                headerRow.appendChild(switcher);
            }
        }

        const trigger = switcher.querySelector(".language-trigger");
        const menu = switcher.querySelector(".language-menu");
        const options = Array.from(switcher.querySelectorAll(".language-option"));
        const focusOption = (index) => {
            const option = options[index];
            if (!option) return;
            option.focus();
            option.scrollIntoView({ block: "nearest" });
        };

        const setMenuOpen = (open) => {
            trigger.setAttribute("aria-expanded", String(open));
            menu.hidden = !open;
        };

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = trigger.getAttribute("aria-expanded") === "true";
            setMenuOpen(!isOpen);
            if (!isOpen) {
                const activeOption = options.find((option) => option.dataset.lang === getLanguage()) || options[0];
                activeOption?.focus();
            }
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
                trigger.focus();
                return;
            }
            if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setMenuOpen(true);
                const activeIndex = options.findIndex((option) => option.dataset.lang === getLanguage());
                focusOption(activeIndex >= 0 ? activeIndex : 0);
            }
        });

        options.forEach((button, index) => {
            button.addEventListener("click", () => {
                setLanguage(button.dataset.lang);
                setMenuOpen(false);
                trigger.focus();
            });

            button.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setMenuOpen(false);
                    trigger.focus();
                    return;
                }
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                    event.preventDefault();
                    focusOption((index + 1) % options.length);
                    return;
                }
                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    focusOption((index - 1 + options.length) % options.length);
                    return;
                }
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    button.click();
                }
            });
        });

        document.addEventListener("click", (event) => {
            if (!switcher.contains(event.target)) {
                setMenuOpen(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
                setMenuOpen(false);
                trigger.focus();
            }
        });
    }

    function applyTranslations() {
        const current = getLanguage();

        document.querySelectorAll("[placeholder], [title], [aria-label], [alt]").forEach((element) => {
            if (originalAttributes.has(element)) return;
            const original = {};
            ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
                if (element.hasAttribute(attribute)) original[attribute] = element.getAttribute(attribute);
            });
            originalAttributes.set(element, original);
        });

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const value = resolveTranslation(current, element.dataset.i18n) || resolveTranslation(DEFAULT_LANGUAGE, element.dataset.i18n);
            if (value && value !== element.textContent.trim()) {
                element.textContent = value;
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            const value = resolveTranslation(current, element.dataset.i18nPlaceholder) || resolveTranslation(DEFAULT_LANGUAGE, element.dataset.i18nPlaceholder);
            if (value) element.setAttribute("placeholder", value);
        });

        document.querySelectorAll("[data-i18n-title]").forEach((element) => {
            const value = resolveTranslation(current, element.dataset.i18nTitle) || resolveTranslation(DEFAULT_LANGUAGE, element.dataset.i18nTitle);
            if (value) element.setAttribute("title", value);
        });

        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            const value = resolveTranslation(current, element.dataset.i18nAriaLabel) || resolveTranslation(DEFAULT_LANGUAGE, element.dataset.i18nAriaLabel);
            if (value) element.setAttribute("aria-label", value);
        });

        document.querySelectorAll("[placeholder], [title], [aria-label], [alt]").forEach((element) => {
            let original = originalAttributes.get(element);
            if (!original) {
                original = {};
                originalAttributes.set(element, original);
            }

            ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
                if (!element.hasAttribute(attribute)) return;
                if (original[attribute] === undefined) original[attribute] = element.getAttribute(attribute);
                const translated = translateText(current, original[attribute]);
                if (translated) element.setAttribute(attribute, translated);
                else if (current === "en" && element.getAttribute(attribute) !== original[attribute]) {
                    element.setAttribute(attribute, original[attribute]);
                }
            });
        });

        const translatedTitle = translateText(current, originalDocumentTitle);
        if (translatedTitle) document.title = translatedTitle;
        else if (current === "en") document.title = originalDocumentTitle;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
            const parent = textNode.parentElement;
            if (!parent || parent.closest("[data-i18n], script, style, textarea, svg, [data-user-content]")) continue;
            if (!originalTextNodes.has(textNode)) originalTextNodes.set(textNode, textNode.nodeValue);
            const original = originalTextNodes.get(textNode);
            const translated = translateText(current, original);
            if (translated) {
                const leading = original.match(/^\s*/)?.[0] || "";
                const trailing = original.match(/\s*$/)?.[0] || "";
                textNode.nodeValue = `${leading}${translated}${trailing}`;
            } else if (current === "en" && textNode.nodeValue !== original) {
                textNode.nodeValue = original;
            }
        }

        updateSwitcher();

        if (!translationObserver && document.body) {
    translationObserver = new MutationObserver((records) => {
        const hasNewContent = records.some((record) => {
            return Array.from(record.addedNodes).some((node) => {
                return node.nodeType === Node.ELEMENT_NODE;
            });
        });

        if (!hasNewContent) return;

        // Delay slightly so multiple dynamic DOM updates
        // are handled together instead of translating repeatedly.
        clearTimeout(window.__internGuideI18nTimer);

        window.__internGuideI18nTimer = setTimeout(() => {
            applyTranslations();
        }, 50);
    });

    translationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}
    }

    document.addEventListener("DOMContentLoaded", () => {
        ensureLanguageSwitcher();
        setLanguage(getLanguage());
    });

    window.addEventListener("load", () => {
        ensureLanguageSwitcher();
        setLanguage(getLanguage());
    });

    window.InternGuideI18n = {
        translations,
        getLanguage,
        setLanguage,
        toEnglishText,
        t,
        applyTranslations,
        updateSwitcher,
        ensureLanguageSwitcher
    };
})();
