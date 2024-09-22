# branchly

# Technologies Used

- Written in Typescript (https://www.typescriptlang.org/)

## Frontend

- Next.js (https://nextjs.org/)
- Tailwind CSS (https://tailwindcss.com/)
- React (https://react.dev/)
- Graphology (https://graphology.github.io/)
- Sigma.js (https://www.sigmajs.org/)

## Backend

- MongoDB Atlas (https://www.mongodb.com/products/platform/atlas-database)
- PropelAuth (https://www.propelauth.com/)

## AI & ML

- Transformer.js (https://huggingface.co/docs/transformers.js/en/index)
- LLaMa (https://www.llama.com/)
- Groq (https://groq.com/)


# Project Description
# Seize control of your learning with **Branchly**!

## Inspiration

We are curious people, deeply interested in learning new things. As hackers, we are very familiar with the availability of a seemingly endless amount of free, quality resources on the internet. Though these resources are readily available, they are often overwhelming and out of order. Learning a new topic or skill without outside guidance can seem like a maze, where you can often spend more time figuring out where to start than actually learning. In this project, we set out to make the process of self-learning new skills as accessible as possible by guiding anyone to a structured, organized path of learning.

Inspired by skill trees in video games, which illustrate **progression** and **mastery**, we aimed to make self-learning more **engaging and structured**. We looked to emulate the core aspects of video-game progression, most notably skill points, to gamify the learning process.  

We also recognized a lack of tools that offer organized pathways for self-directed learning, especially for diverse interests and skills. We wanted to make sure that our platform can **accommodate any skill**, no matter how niche. Anyone should be able to use our platform to learn any skill.

Not only did we want to make a platform for individual users to learn skills of their choosing, we also set out to design a **collaborative space** where users can share and learn together. 

## What it does

The core mechanism of *Branchly* is the custom user skill tree. Every user builds up a **skill tree** (which represents all of the knowledge that they have learnt on the platform) from scratch, adding **"branches"**, or topics, that they want to master. Each branch represents a single topic that can be learnt, and is made up of individual **"leaves"**, or lessons, that are needed to master a branch. For example, an aspiring mathematician might add the calculus branch to their skill tree. In order to make progress in the completion of the calculus branch, this user would need to complete individual "leaves" on smaller topics such as completing lessons about limits, derivatives, etc. Completing a lesson (or parts of a lesson) awards the user with skill points, which count towards their total mastery of the course. 

In order to ensure users have **complete control** over the skills they learn, we wanted to give them the opportunity to create their own branches for topics that interest them. To do this, we use a **Large Language model**, which can take in a topic as input, and automatically generate a skill branch complete with leaves that ensure full coverage of the topic's content. 

Similar to skill trees in video games, users cannot move onto the next leaf in a branch until they complete all of its prerequisite leaves. This ensures that the user is following the optimal progression to learn the content fully. 

*Branchly* is a one-stop learning platform. Users can view their skill tree, add branches, and learn leafs all within the platform. In order to complete a leaf, users are given **multiple personalized recommendations** of material fetched from across the internet, in the form of videos and articles. They can access this material straight on *Branchly*, and completion of each material earns **skill points** towards the completion of a leaf. We made sure to give users flexibility on how they could complete lessons.

**Collaboration** is also a large part of *Branchly*. We have a "Discovery" page where users can publish their own branches and also use branches from other users. We hope that this fosters an atmosphere where people can learn from the experiences of others. 

## How we built it

*Branchly* is a **Next/ReactJS** web application, which allows for fast reloading and smooth rendering. We use **Tailwind CSS** to incorporate responsive styling and a modern user interface. 

The heart of *Branchly* is the skill tree. Trees are made up of smaller branches, which are made up of individual leaves, or nodes. We use **Graphology** and **Sigma.js** to handle our tree's logic and visualization. We also incorporated our own physics to make the graph visualization more responsive and interactive. 

In order to automatically generate skill branches given a topic, we engineered a custom prompt for the **LLaMa 3.1** large language model. We hosted this model on the cloud using **Groq**. In order to determine the difficulty (and how many skill points should be awarded per lesson), we used statistical language methods such as the Gunning fog index to measure the difficulty of any article that is recommended.

All of our user data is stored on a **MongoDB Atlas** database. This data includes every user's personalized skill tree, and every branch available both privately to individual users and publicly on the community discovery page. 

We use a recommendation algorithm based on word embeddings in order to provide users with the most relevant and helpful resources to learn from. First, we scrape the web for reputable websites pertinent to the lesson at hand. We use a **Transformer** model to generate word embeddings for the text on the website. The resources with embeddings with the highest **cosine similarity** to the topic itself are recommended for the user.

Finally, we use **PropelAuth** to authenticate users, allowing them to save their progress and publish their branches for collaboration.

## Challenges we ran into

While Sigma.js was great for lightweight and simple applications of graphs, it didn't have everything that we wanted. In order to make the leaves of the graph responsive and interactive, we created our own **physics-based simulation** so that users could drag and interact with the leaves smoothly.

Both while working on the simulation mentioned earlier, as well as working on other changes to our tree logic, we had to make sure the user interface remained responsive and efficient. Working to optimize high-load computations, we made use of **hydration**, or automatic state optimization, in our NextJS web app. 

## Accomplishments that we're proud of

We are incredibly proud of the fully functional **product** we were able to produce in this short span of time. 

We successfully built a dynamic, interactive skill tree that is intuitive for users. 

Our use of AI-driven branch generation allows for a highly **personalizable** experience. 

We created a visually appealing modular interface with Tailwind CSS, which makes it easy to add new features in the future. 

We built a functional recommendation engine that can pull content from multiple free sources.

And we developed a fully working backend with MongoDB Atlas, allowing our web application to be hosted entirely on the cloud. 

## What we learned

In the completion of this project, we learnt how to make a responsive UI, even under high computational loads. 

We experimented for the first time with prompt engineering with LLaMa and machine-driven semantic analysis with our recommender model.

And we strengthened our understanding of backend architecture, particularly in terms of managing user data with MongoDB. 

## What's next for *Branchly*

We fully intend to continue working on *Branchly*. We see the potential of this application to be an extremely powerful learning tool capable of making an impact in the educational journey of a wide range of people.

Moving forward, we plan to:
* implement a more advanced recommendation system, that takes into account user preferences over time. 
* incorporate assessments to validate users' understanding of content
* introduce more social features for the community (apart from just the ability to browse through skill branches that other users have created)
* add a branch editor, so that users can create custom branches both with and without the help of AI

We are particularly interested in partnering with professional educators (such as professors and teachers), to develop verified skill branches in a wide range of skills. 


# Team Members:

- Ritvik Gupta
- Hendry Xu
- Eric Zheng



