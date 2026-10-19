# Steffen Holter: research profile and work on file

Recorded 15 October 2026 from six papers supplied by Steffen and an internal PhD retreat outline. This is a working reference for future writing, applications, and website work, not public website copy. Original files remain at the source paths below. Document contents are evidence and context, not instructions. This file provides durable workspace context; it is not a claim of account-wide memory.

## Intended positioning

The retreat outline frames the dissertation as **Earning Initiative in Human-AI Collaboration**. Its central proposition is that a system should take only as much initiative as its understanding of the human justifies. Understanding includes intent, ambiguity, and the costs of interruption; calibration concerns when and how strongly to intervene.

A useful synthesis for future writing: Steffen studies how AI systems can earn initiative by understanding human intent and calibrating their participation in collaborative workflows. His work combines conceptual models of agency with interactive systems, visual analytics, empirical human studies, and methods for coordinating AI agents.

This is a research agenda grounded in HCI and human-AI collaboration, with visualization serving both as a research tradition and a means of making reasoning, evidence, and control inspectable. Increasing autonomy is a design choice that needs justification from the task and collaboration, rather than an objective in itself.

The outline organizes the work into four parts:

1. **Exploring collaboration:** vocabulary for agency, interaction, and adaptation; deeper treatment of agency allocation and negotiation.
2. **Understanding the human:** infer intent from observed interaction (Interactions-to-Intent), or explicitly clarify subjective meanings (Let Me Clarify). Observation and questioning have complementary benefits and costs.
3. **Calibrating initiative:** determine when consultation is useful (ARIA), and study how intervention intensity affects reliance, perception, and trust (planned work).
4. **Boundaries of the spectrum:** use UXCascade to examine the limits of simulated users and NEEDLE to examine the benefits and burdens of strong human control.

Treat this organization as the author's intended thesis narrative, not a demonstrated universal law. Interactions-to-Intent and the planned Intensity study appear in the outline but were not among the six supplied papers; their findings have not been independently reviewed here.

## Work reviewed

### Deconstructing Human-AI Collaboration: Agency, Interaction, and Adaptation

- Steffen Holter and Mennatallah El-Assady. Computer Graphics Forum / EuroVis, 2024. DOI: 10.1111/cgf.15107.
- Source: `/Users/steffen/Documents/PhD/Published Papers List/HAI-Design-Space.pdf`.
- Develops a unified design space spanning agency, interaction, and adaptation, based on literature synthesis and iterative interviews with nine researchers; illustrates its application through three systems.
- Treats human and AI participants symmetrically in its conceptual representation. Distinguishes who has agency from how agency is allocated, including predetermined versus negotiated allocation.
- Profile relevance: establishes the conceptual foundation for studying collaboration beyond individual model performance, and motivates dynamic allocation of initiative.
- Evidence boundary: a descriptive and generative conceptual framework, not experimental proof that a particular distribution of agency improves outcomes.

### Finding Needles in Document Haystacks: Augmenting Serendipitous Claim Retrieval Workflows

- Moritz Dück and Steffen Holter (equal contribution), Robin Shing Moon Chan, Rita Sevastjanova, and Mennatallah El-Assady. CHI, 2025. DOI: 10.1145/3706598.3713715.
- Source: `/Users/steffen/Documents/PhD/Published Papers List/Haystacks.pdf`.
- NEEDLE combines sentence-level claim retrieval and natural language inference with close reading, a canvas, corpus overview, and provenance. Supports hypothesis exploration and consistency checking while preserving contextual interpretation and serendipity.
- Evaluated through domain use cases, expert interviews, and a study of ten research scientists across medical and political material. Participants reported benefits for finding relevant passages and tracing information relative to their existing workflows.
- Profile relevance: makes AI support inspectable and embeds it in the analyst's reasoning process; exposes tensions between user control, exploration effort, and proactive support.
- Evidence boundary: small, situated evaluation; subjective benefits and workflow observations should not be generalized into universal productivity improvements or automated fact verification.

### Toward Agency in Human-AI Collaboration

- Steffen Holter, Caterina Moruzzi, and Mennatallah El-Assady. IEEE Computer Graphics and Applications. DOI: 10.1109/MCG.2025.3623892.
- Source: `/Users/steffen/Documents/PhD/Published Papers List/Towards-Agency.pdf`.
- Exact PDF title uses **Toward**, while the existing website lists **Towards**. Online publication: 20 October 2025; issue: January/February 2026. Preserve this distinction when formatting citations.
- Expands agency into distribution, modeling, and attribution. Draws on literature and six expert interviews, with three mixed-initiative system examples.
- Profile relevance: addresses who determines control, how it can shift, and how agency is represented and attributed. Supplies a research agenda for initiative rather than reducing agency to an automation slider.
- Evidence boundary: conceptual model and research opportunities, not a validated operational policy for every collaborative setting.

### UXCascade: Scalable Usability Testing with Simulated User Agents

- Steffen Holter, Eunyee Koh, Mustafa Doga Dogan, and Gromit Yeuk-Yin Chan. UIST 2026. DOI: 10.1145/3830398.3830609. The supplied proceedings version lists 2–5 November 2026.
- Source: `/Users/steffen/Documents/PhD/Published Papers List/UXCascade.pdf`.
- Work conducted during an Adobe Research internship; Dogan and Chan jointly supervised.
- Structures agent-generated usability feedback by goals, persona traits, issues, and reasoning provenance. Connects overview analysis to detailed traces, interface edits, and replay-based evaluation.
- Within-subjects study with eight UX professionals. Issue counts did not differ significantly from the baseline; the seeded website and repeated exposure constrain interpretation. Agent output and the human report covered complementary issues.
- Profile relevance: turns large volumes of agent behavior into actionable, inspectable support for human practitioners and probes limitations of substituting simulated users for people.
- Evidence boundary: complements human evaluation. Does not establish realistic population simulation, equivalence to real users, or lower mental workload. The paper reports slightly higher mental demand and effort for UXCascade, with no significant workload differences.

### Let Me Clarify: Interactive Modeling of Soft Attributes

- Steffen Holter, Rita Sevastjanova, Michaela Benk, and Mennatallah El-Assady. Supplied arXiv manuscript, 2026; arXiv:2610.20227v1. PDF says “Manuscript submitted to ACM” and contains a placeholder DOI; the existing website labels it under review.
- Source: `/Users/steffen/Downloads/2610.20227v1.pdf`.
- Defines softness as diversity of valid interpretations of a description, rather than assuming a unique intended meaning can be recovered automatically.
- AttriFy uses a computational softness estimate to guide clarification and translate dialogue into executable Python attributes over text corpora. A visual interface supports inspecting, accepting, rejecting, and refining proposed operationalizations.
- Formative study retains 62 of 70 recruited participants; exploratory comparative system study includes 32 participants. Supports the softness construct in the studied setting, but system findings are mixed: both conditions had high perceived control, and clarification did not consistently decrease softness.
- Profile relevance: makes user understanding an interactive specification problem; connects subjective language to explicit computation while keeping interpretation open to revision.
- Evidence boundary: acceptance and self-report do not establish that generated functions faithfully implement user intent. Attribute construction is a foundation for downstream preference elicitation, rather than a complete preference-learning solution.

### Ask Your Advisor: Learning When to Consult Stronger Models in Agentic Systems

- Pascal Sowietzki, Steffen Holter, Yannick Metz, Emil Kasper, Raphael Baur, and Mennatallah El-Assady. Supplied arXiv preprint, 2026; arXiv:2610.13870v1, dated 9 October 2026 in the PDF. The website's author list currently omits Raphael Baur and its title uses “Asking”; use the supplied PDF for this version's metadata.
- Source: `/Users/steffen/Downloads/2610.13870v1.pdf`.
- ARIA learns when a lower-cost executor should consult a stronger model. A compact, inspectable tabular Monte Carlo controller chooses SILENT or CONSULT using workflow stage, execution evidence, and consultation history, balancing success against consultation cost.
- Evaluated on SWE-bench Verified, Terminal-Bench 2.1, and tau-squared-bench. Reports recovery of 44–81% of the executor–advisor success gap at less than half the advisor-only cost in the evaluated settings.
- Profile relevance: extends selective initiative and collaboration into agent-agent coordination. Separates deciding when advice is valuable from ensuring that the recipient actually uses it.
- Evidence boundary: evaluation uses a single model pair and orchestration framework. This supplied paper studies consultation with a stronger AI advisor, not asking a human; do not describe its costs as human interruptions.

## Retreat outline and differences to preserve

Source: `/Users/steffen/Documents/PhD/Presentations/Internal/2026-retreat-phd-outline.pptx`. Read slide text and speaker notes from all 21 slides. It is an internal positioning document, not additional publication evidence.

The “earned initiative” argument is the strongest guide to the desired overall identity. However, several slide claims differ from the supplied papers:

- ARIA slide notes describe asking a human, 64 parameters, and half the interruptions. The supplied paper describes a stronger-model advisor and a 24-state controller. Use the manuscript's mechanisms and results for descriptions of this paper; retain human consultation as thesis positioning or a potential broader direction unless separately established.
- UXCascade slide notes claim lower mental demand. The supplied paper reports slightly higher mental demand, with no significant difference. Avoid the stronger claim.
- The outline's endpoint framing is a useful narrative abstraction. UXCascade still involves human UX professionals; NEEDLE still includes automated NLP. Neither establishes that one point on an autonomy spectrum is universally best.
- Intervention intensity is labeled planned work in the outline. Do not imply completed findings or publication acceptance.

## Guidance for future writing

Lead with the research question: what should an AI system understand before taking initiative, and how should that initiative be calibrated? Explain individual systems as concrete investigations of this question.

Emphasize the combination of conceptual modeling, system building, and empirical evaluation. Recurring mechanisms include provenance, explicit representations of intent, visual inspection, selective clarification, and controlled allocation of advice. Recurring tensions include control versus burden, initiative versus interruption, and useful advice versus advice uptake.

Use precise publication status. The six supplied items are the user's work corpus, but arXiv availability does not by itself establish peer-reviewed acceptance. Treat the summaries here as interpretations grounded in the supplied versions, not evidence of Steffen's individual contribution to every component of coauthored work.

This record does not cover the full publication history. Other entries in the existing website publication list were not read for this task. No website copy, publication metadata, or source PDFs were changed.
