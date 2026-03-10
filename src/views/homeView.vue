<template>
    <div class="container-fluid"> 
        <!-- Welcome Banner -->
        <div class="row" id="title-row">
            <div class="row">
                <h2 id="page-heading">Welcome </h2>
            </div>
            <div>
                <p> At Wellbeing Matter, we believe that mental health is just as important as physical health. 
                    Our mission is to support individuals in taking control of their mental well-being by providing accessible resources, 
                    compassionate support, and a community of care.
                </p>
            </div>
        </div>
        <!-- Navigation sidebar to help traverse page (not functional yet) -->
        <div class="row">
            <div class="col-12 col-md-2" id="sideBar">
                <Button class="sideBarButton" id="toOurMission"> Our Mission </Button>
                <Button class="sideBarButton" id="toHowWeHelp"> How We Can Help </Button>
                <Button class="sideBarButton" id="toGetInvolved"> Get Involved </Button>
                <Button class="sideBarButton" id="toTestimonials"> Testimonials </Button>
            </div>
            <!-- Page Content -->
            <div class="col-12 col-md-10">
                <!-- Mssion -->
                <div class="row content-section mb-4">
                    <h3 class="sub-heading">
                        Our Mission
                    </h3>
                    <p>
                        We are dedicated to raising awareness, providing education, and offering direct support to those experiencing mental health challenges. 
                        Whether you're seeking help for yourself, a loved one, or just looking to learn more, we are here to guide you every step of the way.
                    </p>
                </div>
                <hr>
                <!-- How we can help -->
                <div class="row content-section mb-4">
                    <h3 class="sub-heading">
                        How We Can Help
                    </h3>
                    
                    <h5>Educational Resources </h5>
                    <p>Access a wealth of information on mental health topics. Our articles, guides, and videos are designed to educate and empower you to take control of your mental well-being. </p>

                    <h5>Locate Support Groups</h5>
                    <p>Find local and online support groups where you can connect with others who understand what you're going through. Our directory makes it easy to find the right group for you.</p>

                    <h5>Community Engagement</h5>
                    <p>Join a supportive community where you can share experiences, attend workshops, and participate in events aimed at fostering mental well-being.</p>
                </div>
                <hr>
                <!-- Get involved -->
                <div class="row content-section mb-4">
                    <h3 class="sub-heading">
                        Get Involved
                    </h3>
                    <p>
                        Your support helps us reach more people in need. Learn how you can make a difference by volunteering, donating, or advocating for mental health awareness in your community.
                    </p>
                </div>
                <hr>
                <!-- Testimonials -->
                <div class="row content-section mb-4">
                    <h3 class="sub-heading">
                        Testimonials
                    </h3>
                    <p>
                        "Thanks to Wellbeing Matters, 
                        I found the strength to face my challenges and seek help. The support I've received has been life-changing."
                        — Sarah, 34
                    </p>
                    <p>
                        "The resources available on this site have been a lifeline. It's comforting to know I'm not alone."
                        — John, 28
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
#title-row {
    background-color: var(--light-blue-primary);
    display: flex; 
    padding: 10px;
    margin-top: 20px;
}

.content-section {
    padding: 10px;
    margin-top: 20px;
}

.sideBarButton {
    justify-self: left;
    background-color: white;
    color: var(--light-blue-primary);
    border-style: hidden;
    padding: 20px;
    width: 100%;
}

.sub-heading {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

@media (max-width: 768px) {
    .sub-heading {
        font-size: 1.25rem;
    }
}
</style>