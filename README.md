# Web Aiki

## Introduction
This is the source code of Muhammad Faran Aiki's personal website.
His social media:
1. X/Twitter: https://x.com/FaranAiki
2. LinkedIn: https://www.linkedin.com/in/muhammad-faran-aiki-8a6305343/

### The Usage of This Project
I made this page so that I can share my LIFE. Most people do not care, but I do not care about the uncareness of them.
However, there are some real benefits of creating this page, such as 
* College: this is where I share most of my college assignments so people can learn
* Portfolio: to flex things
* Hobby: I love creating things!
* See the BACCM

### Motivation
One of my friends in the same faculty as mine (School of Electrical Engineering and Informatics - Computation) inspired me to make a personal website. So, I said, why not? Because of that single motivation, I learned a bunch of things. Thank you, the leader of SEEI-C 2025.

### What I have learned
I learned
1. How to use ReactJS + NextJS + Tailwind 
2. How to use AI at its maximum potential
3. How to do debug properly
4. How to use API, such as YouTube (using Google APIS in backend)
5. How to use Gemini API
6. The real difference between client-side (POST method) and server-side ("use server")
7. Error handling
8. Integrating BABOK and others into this project

## Implementation System

These are the techniques and framework involved to standardize the process of creating this website 

### Business Analysis Core Concept Model (BACCM) 
Context-Need-Stakeholder-Solution-Change-Value
This framework defines the value proposition of faranaiki.id in the context of the current professional landscape.

| Core Concept | Description | Project Application |
| :--- | :--- | :--- |
| **Context** | The circumstances that influence the change. | The 2025 tech landscape where "raw coding" is commoditized, making "AI implementation and analytical rigour" the primary differentiators. |
| **Need** | A problem or opportunity to be addressed. | The urgent requirement to bypass automated recruiter filters by providing high-signal proof of AI-native engineering and system thinking. |
| **Stakeholder** | A group or individual with a relationship to the change. | **Recruiters:** Seeking proof of skill; **Tech Leads:** Seeking architectural depth; **Me:** Seeking career growth and brand ownership; **Users:** General people who access the website |
| **Solution** | A specific way of satisfying one or more needs in a context. | A high-performance Next.js platform featuring Gemini-integrated UI, multi-language support, and documented BA frameworks (Kano, BACCM). |
| **Change** | The act of transformation in response to a need. | Transitioning from a "standard applicant" with a static CV to a "technical architect" with a dynamic, living ecosystem. |
| **Value** | The worth, importance, or usefulness to a stakeholder. | **Recruiters:** Reduced time-to-hire; **Me:** Increased interview conversion rates and a centralized hub for all professional/creative IP; **Users:** Access general information and knowledge (through College link) in faranaiki.id |

### Kano Method Analysis (MPAIR)
This is the final revision of each features that exists. 
| Kano Matrix | Must Have | Performance | Attractive | Indifferent | Reverse |
| -------- | -------- | -------- | -------- | -------- | -------- |
| Done | Basic Portfolio | SEO Searching  | Dark Mode, Chat Bot | Perfect Pixel Adjustment |  |
| In Review |  |  | Fixing Chat Bot's Gemini Feature |  |  |
| In Progress |  |  |  | Documentation for Code |  |
| To Do |  | Speed for Components | Animations |  |  |
| Backlog |  |  | Integration with OS for Qemu Project | Epilepsy Prevetion Dark Mode to Light Mode  |  |

### Example Flowchart Modelling for Basic Interaction
Example flowchart model to understand how UI are implemented
```mermaid
flowchart LR
    %% Terminal Start (Use Oval for standardized thing)
    Start([Start User Access Website]) --> Show[Show Main Content]

    %% Main Interaction Node
    Show --> UserInput{User Interaction}

    %% Feature: Chat Interface Q&A
    UserInput -->|Chat Bot| ChatBubble[/Chat Bubble Icon/]
    ChatBubble --> ChatWindow[Open Chat Window]
    ChatWindow --> AskInput[/Input Question/]
    AskInput --> ClickSend[Click Send Button]
    ClickSend --> Answer[Display Answer]
    Answer --> Show

    %% Navigation Feature
    UserInput -->|Navigation| NavBar[/Navigation Bar/]
   
    %% Connect Navigation bar to show
    NavBar -->|Beranda| Show
   
    %% Profile
    NavBar -->|Profile| SubProfile{Branch Profile}
    SubProfile -->|Social| Social[Social Page]
    SubProfile -->|Certificate| Cert[Certificate Page]
   
    %% Experience
    NavBar -->|Experience| SubExp{Branch Experience}
    SubExp -->|Work| Work[Job Page]
    SubExp -->|Projects| Proj[Projects Page]
    SubExp -->|Organization| Org[Organization Page]
    SubExp -->|Awards| Award[Awards Page]
    
    %% Art 
    NavBar -->|Art Works| SubArt{Branch Art Works}
    SubArt -->|Music| Music[Music Page]
    SubArt -->|Literature| Literature[Literature Page]
   
    %% College
    NavBar -->|College| College[College Page]

    %% Personalization Features and System Display
    UserInput -->|Language| LangBar[/Language Bar/]
    LangBar --> LangList[ID EN ZH JA RU FR AR]
    
    UserInput -->|Theme| ThemeBar[/Theme Bar/]
    ThemeBar --> ThemeOptions[System Light Dark]

    %% Universal Back Loop
    Social & Cert & Work & Proj & Org & Award & Music & Literature & College & LangList & ThemeOptions --> Show
```

## Coding

### Language and Framework

Implemented using TypeScript, NextJS, and TailwindCSS.

### Template 
The first version (scratch and template) is generated using Gemini with the prompt of 
>buatlah website untuk personal dengan menu:
>
>About Me
>Music
>Technology
>College Collections
>Publishing and Literature
>dan dengan satu menu popup yang berjudul "Ask me about anything" dengan textbox dan tombol submit di bawah kiri
>Menggunakan next.js dan tailwind dengan fail yang terpisah untuk github

# Closing
Other than that, the website is made by me for a simple project.
(And AI tools assitant because I can code, so I don't vibe code lol)
(I just hate reading documentation, that's it.)
