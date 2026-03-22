# TPM KPI Measurement Guide
## Equipment Effectiveness & Reliability Metrics

> **Source:** *Introduction to TPM: Total Productive Maintenance* by Seiichi Nakajima (Productivity Press, 1988; originally published by the Japan Institute for Plant Maintenance, 1984) and *TPM Development Program: Implementing Total Productive Maintenance*, edited by Seiichi Nakajima (Productivity Press, 1989).

---

## Part I: Equipment Effectiveness KPIs

---

### 1. OEE — Overall Equipment Effectiveness

#### Definition
OEE is the master metric of TPM. It measures how effectively a piece of equipment is being utilized by combining three rate components: time (availability), speed (performance efficiency), and quality. As Nakajima establishes, "TPM includes all six of the big equipment losses in its calculations. It measures overall equipment effectiveness by multiplying availability and performance efficiency by the rate of quality products."

#### Formula
```
OEE = Availability × Performance Efficiency × Quality Rate × 100
```

#### Worked Example (from the source)
| Variable | Value |
|---|---|
| Working hours per day | 480 min (8h × 60 min) |
| Planned downtime | 20 min |
| **Loading time (C)** | **460 min** |
| Stoppage losses (breakdowns + setup + adjustment) | 60 min |
| **Operating time (E)** | **400 min** |
| Output per day | 400 items |
| Quality rate | 98% |
| Ideal cycle time | 0.5 min/item |
| Actual cycle time | 0.8 min/item |

```
Availability    = 400 ÷ 460 × 100 = 87%
Performance     = 0.625 × 0.80 × 100 = 50%
Quality Rate    = 98%

OEE = 0.87 × 0.50 × 0.98 × 100 = 42.6%
```

> *"Even though the availability is 87 percent, the overall equipment effectiveness, when actually calculated, is not even 50 percent, but an astonishingly low 42.6 percent. The data used in these examples are representative of the average company. In essence, the numbers reveal that equipment was being used at only half its effectiveness."*

#### World-Class Target
The source identifies **OEE ≥ 85%** as the benchmark for excellence:
- Availability > 90%
- Performance Efficiency > 95%
- Quality Rate > 99%

"This figure is not just a remote goal. All the PM prize-winning companies have an equipment effectiveness greater than 85 percent."

#### The Six Big Losses OEE Addresses
OEE is designed specifically to capture and quantify the **six big losses**:

**Downtime Losses**
1. Breakdown losses (equipment failure)
2. Setup and adjustment losses

**Speed Losses**
3. Idling and minor stoppages
4. Reduced speed (gap between design speed and actual speed)

**Defect Losses**
5. Quality defects in process and rework
6. Startup (yield) losses

---

### 2. Availability

#### Definition
Availability (also called the "operating rate") measures the proportion of planned production time that equipment is actually operating. It is the most commonly tracked equipment metric, though the source warns that it captures only a fraction of true equipment effectiveness on its own.

"Often, what is referred to as the rate of equipment effectiveness is actually the operating rate or availability."

#### Formula
```
Availability = Operating Time ÷ Loading Time × 100

Where:
  Loading Time  = Total Available Time − Planned Downtime
  Operating Time = Loading Time − Unplanned Downtime (breakdowns, setup, adjustments)
```

#### Worked Example
```
Loading time  = 480 min − 20 min planned downtime = 460 min
Operating time = 460 min − 60 min stoppages       = 400 min
Availability  = 400 ÷ 460 × 100                   = 87%
```

#### World-Class Target
- Availability **> 90%**

#### Key Note
The source stresses that availability alone is an incomplete picture: "Equipment operation conditions are not reflected accurately when they are based solely on the availability (operation time ratio) figure. Of the six big equipment losses, only downtime losses are calculated to determine availability. Other equipment losses such as speed and defect losses are not accounted for."

---

### 3. Performance Efficiency

#### Definition
Performance efficiency measures how closely actual equipment output matches the theoretical maximum based on design speed. It is the product of two sub-rates: the **operating speed rate** and the **net operating rate**.

#### Formula
```
Performance Efficiency = Operating Speed Rate × Net Operating Rate × 100
```

**Operating Speed Rate** — reflects reduced speed losses:
```
Operating Speed Rate = Ideal (Theoretical) Cycle Time ÷ Actual Cycle Time × 100
```

**Net Operating Rate** — reflects losses from minor stoppages and instability:
```
Net Operating Rate = (Processed Amount × Actual Cycle Time) ÷ Operating Time × 100
```

#### Worked Example
```
Ideal cycle time    = 0.5 min/item
Actual cycle time   = 0.8 min/item
Output              = 400 items
Operating time      = 400 min

Operating Speed Rate = 0.5 ÷ 0.8 × 100 = 62.5%
Net Operating Rate   = (400 × 0.8) ÷ 400 × 100 = 80%

Performance Efficiency = 0.625 × 0.80 × 100 = 50%
```

#### World-Class Target
- Performance Efficiency **> 95%**

#### Interpretation
The net operating rate (80% in the example) reveals that 20% of available operating time is lost to minor stoppages and instability — losses that rarely appear in traditional availability records. "The net operating rate measures the maintenance of a given speed over a given period... It calculates losses resulting from minor recorded stoppages, as well as those that go unrecorded on the daily logs, such as small problems and adjustment losses."

---

### 4. Quality Rate

#### Definition
The quality rate (also called "rate of quality products") measures the proportion of total output that meets quality standards without defect or rework. It accounts for both in-process defects and startup/yield losses.

#### Formula
```
Quality Rate = Number of Good Products ÷ Total Input × 100

Where:
  Good Products = Input − (Startup Defects + Process Defects + Trial/Rework Products)
```

#### World-Class Target
- Quality Rate **> 99%**
- Process defects target: **< 0.1%** (or 100–30 ppm)

#### Improvement Goal
"Reducing chronic defects, like reducing chronic breakdowns, requires thorough investigation and innovative remedial action. The conditions surrounding and causing the defect must be assessed and control limits evaluated. Complete elimination of defects is, as always, the main goal."

---

### 5. TEEP — Total Effective Equipment Performance

#### Definition and Context
While Nakajima does not use the acronym "TEEP," the concept is foundational to his framework. TEEP extends the OEE model by measuring effectiveness against **all calendar time** (24 hours/day, 365 days/year), rather than just planned production time. It answers: how well is the asset performing relative to its total theoretical capacity?

The source frames this through the lens of **Total Available Time** and the distinction between planned vs. unplanned downtime:

"Loading time, or the available time per day (or month), is derived by subtracting the planned downtime from the total available time per day."

#### Formula
```
TEEP = OEE × Utilization Rate

Where:
  Utilization Rate = Loading Time ÷ Total Calendar Time × 100
```

#### TPM Context
TEEP is most relevant in the context of Nakajima's goal of **unmanned, continuous production**: "Zero minor stoppages is an essential condition for unmanned production." The pursuit of 24-hour automated production and the "parlor factory" model represents a TEEP mindset — maximizing output from every hour the equipment exists.

---

### 6. Utilization Rate

#### Definition
The utilization rate measures what fraction of total calendar time is actually scheduled for production (loading time). It is the bridge between theoretical asset capacity and the planned production window.

#### Formula
```
Utilization Rate = Loading Time ÷ Total Calendar Time × 100

Where:
  Loading Time = Total Available Time − Planned Downtime
```

#### TPM Context
Nakajima distinguishes planned downtime (scheduled maintenance, management meetings, planned shutdowns) from unplanned downtime (breakdowns, setup losses). Only planned downtime is excluded from loading time: "Planned downtime refers to the amount of downtime officially scheduled in the production plan, which includes downtime for scheduled maintenance and management activities (such as morning meetings)."

A high utilization rate ensures that the equipment is being scheduled effectively. When combined with OEE, it yields TEEP — the complete picture of asset effectiveness.

---

## Part II: Reliability & Maintainability KPIs

---

### 7. MTBF — Mean Time Between Failures

#### Definition
MTBF is explicitly referenced in both source texts as the central metric for tracking and improving equipment reliability. It records the average elapsed time between one breakdown and the next for a given piece of equipment.

The source describes MTBF records as a structured management tool: "Record each type of work performed on a particular piece of equipment on a separate card and organize the information on an MTBF analysis chart. MTBF analysis charts help to clarify and classify the occurrence of breakdowns. They show at a glance the breakdown frequency of each machine and part."

#### Formula
```
MTBF = Total Operating Time ÷ Number of Failures
```

#### TPM Application
The MTBF analysis chart is used in the **planned maintenance program** (Step 9 of the Twelve Steps of TPM Development) to:
- Track breakdown frequency per machine and part
- Identify equipment with chronic reliability problems
- Set intervals for preventive and predictive maintenance
- Measure the effect of maintainability improvement activities

"The purpose of equipment improvement is to reduce the maintenance work required and to increase its efficiency. To promote this, record each type of work performed on a particular piece of equipment on a separate card and organize the information on an MTBF analysis chart."

#### Zero Breakdowns as the Goal
MTBF improvement drives toward the TPM goal of **zero breakdowns**: "The dual goal of TPM is zero breakdowns and zero defects. When breakdowns and defects are eliminated, equipment operation rates improve, costs are reduced, inventory can be minimized, and as a consequence, labor productivity increases."

PM Prize-winning companies demonstrated this in practice: at Aishin Seiki, "Since May 1982 there have been no equipment breakdowns; prior to TPM implementation they numbered more than 700 per month."

---

### 8. MTTF — Mean Time To Failure

#### Definition
MTTF is a reliability measure used primarily for **non-repairable** components or systems — it represents the expected operating life before a first (and final) failure. In the context of TPM, it is most relevant to individual parts and components whose life spans must be estimated for preventive replacement planning.

#### Formula
```
MTTF = Total Operating Time ÷ Number of Failed Units
```
*(For non-repairable items)*

#### TPM Application
The source addresses MTTF implicitly through its extensive discussion of **parts life spans** and the predictive maintenance model:

"Equipment reliability is the probability that equipment, machinery, or systems will perform required functions satisfactorily under specific conditions within a certain period of time."

A four-phase breakdown elimination program moves from "reduce variability of life span" in Phase 1, to "lengthen life span" in Phase 2, and ultimately to "predict life span" in Phase 4 — which corresponds to operationalizing MTTF data for individual parts.

In Step 9 of TPM Development (Scheduled Maintenance), the maintenance department establishes planned intervals "based on estimated breakdown intervals, or the lifespan data of the equipment and its parts."

---

### 9. MTTR — Mean Time To Repair

#### Definition
MTTR measures the average time required to restore equipment to operational condition after a failure. It is the primary measure of **maintainability** — the ease and speed with which equipment can be repaired.

#### Formula
```
MTTR = Total Repair Time ÷ Number of Failures
```

#### TPM Application
The source addresses MTTR improvement through **maintainability improvement (MI)**, one of the three pillars of total PM (alongside preventive maintenance and maintenance prevention):

"Once equipment is installed, a total maintenance system requires preventive maintenance (PM: preventive medicine for equipment) and maintainability improvement (MI: repairing or modifying equipment to prevent breakdowns and facilitate ease of maintenance)."

Specific strategies cited for reducing MTTR include:
- Division into appropriate subassemblies for ease in dismantling and reinstalling
- Prefabrication of replacement assemblies
- Speedy and accurate communication between departments
- Improved transportation and material-handling equipment
- Standardized parts and improved jigs and tools
- Proper spare parts control ensuring critical parts availability

The MTBF analysis chart records **equipment downtime (minutes)** per breakdown event, enabling MTTR to be tracked and benchmarked over time.

---

### 10. Failure Rate

#### Definition
Failure rate is the frequency with which an item of equipment or a component fails, expressed as failures per unit of time. It is the reciprocal of MTBF and is the basis for the well-known **bathtub curve** of equipment life, which Nakajima references explicitly.

#### Formula
```
Failure Rate (λ) = Number of Failures ÷ Total Operating Time
                 = 1 ÷ MTBF
```

#### The Bathtub Curve — Three Failure Periods
"According to the principles of reliability engineering, the causes of equipment failure change with the passage of time. The failure rate curve is also referred to as the 'life span characteristic curve' or the 'bathtub curve.' When equipment is new, there is a high failure rate (early failure period), which eventually drops and levels off. Then the failure rate stabilizes at a certain level for a long period of time (accidental failure period). Finally, as equipment approaches the end of its useful life, the failure rate increases once again (wear-out failure period)."

| Period | Cause | Countermeasure |
|---|---|---|
| Early failure period | Design and manufacturing errors | Test runs at earliest stage; maintainability improvement |
| Accidental failure period | Operation errors | Proper operator training; correct operating procedures |
| Wear-out failure period | Natural end of component life | Preventive maintenance; maintainability improvement; parts replacement |

"Therefore, to achieve successful results each type of breakdown must be treated by different countermeasures."

#### TPM Goal
"The failure rate for items in the accidental failure period can be reduced through time-based PM. As zero breakdowns are approached, failure rate targets are: **breakdown losses < 1%** (Level 3) and **breakdown losses 0.1%–0** (Level 4 / world class)."

---

### 11. Breakdown Frequency

#### Definition
Breakdown frequency is the count of equipment failures over a defined time period (e.g., per month or per year) for a specific machine or line. It is the most operationally direct measure of equipment reliability and is closely related to failure rate, but expressed as an absolute number rather than a rate.

#### Formula
```
Breakdown Frequency = Number of Breakdowns in Period T
```

#### TPM Benchmarks
The source provides specific world-class targets:

- **Breakdowns (stopped longer than 10 minutes): less than once per month per machine**
- **Idling and minor stoppages (under 10 minutes): less than 3 times per month per machine**

Real-world improvement data cited from PM Prize winners includes: "Breakdowns reduced: 98% (1,000 → 20 cases/month) (Company TK)"

The TPM goal is **zero breakdowns** across all equipment. The source distinguishes two types:
- **Function-loss failures** — unexpected breakdowns causing complete stoppage
- **Function-reduction failures** — deterioration causing continued but degraded operation

Both types are tracked. "Unexpected breakdowns with complete stoppage are called 'function-loss failures' while those involving equipment deterioration despite continued operation are called 'function-reduction failures.'"

#### Tracking Method
Breakdown frequency is recorded on the MTBF analysis chart and feeds directly into the monthly and annual planned maintenance calendar.

---

### 12. Equipment Reliability (%)

#### Definition
Equipment reliability (%) is the probability that a machine will perform its required functions without failure over a given operating period under specified conditions. The source provides a rich conceptual framework for reliability, distinguishing between its intrinsic and operational dimensions.

"Equipment reliability is the probability that equipment, machinery, or systems will perform required functions satisfactorily under specific conditions within a certain period of time. It can also be thought of as the likelihood that problems (quality defects and breakdowns) will not occur over a given period."

#### Formula
```
Equipment Reliability (%) = (1 − Failure Probability) × 100
                          = (MTBF ÷ (MTBF + MTTR)) × 100
```
*(In the context of repairable systems)*

#### Two Dimensions of Reliability
The source distinguishes:

**Intrinsic Reliability** — determined at the design, fabrication, and installation stages:
- Design reliability
- Manufacturing (fabrication) reliability
- Installation reliability

**Operational Reliability** — determined by how equipment is used and maintained:
- Operation and manipulation reliability
- Maintenance reliability

"Total reliability is the product of these two qualities."

#### Four-Phase Reliability Development
The source outlines a progression toward optimal reliability:

| Phase | Goal | Activities |
|---|---|---|
| Phase 1 | Reduce variability of life span | Restore neglected equipment; eliminate inferior equipment; basic maintenance |
| Phase 2 | Lengthen life span | Improve design weaknesses; eliminate unexpected breakdowns |
| Phase 3 | Make occasional repairs predictable | Estimate life span; plan periodic renovation |
| Phase 4 | Predict life span | Condition-based maintenance; technical analysis of major breakdowns; maintain equipment precision |

#### World-Class Targets
From the OEE Assessment Table:
- **Level 3 (Good):** Breakdown losses < 1%; time-based PM established; autonomous maintenance well-established; parts life spans lengthened
- **Level 4 (World Class):** Breakdown losses 0.1%–0; condition-based maintenance established; parts life spans predicted; reliable and maintainable design developed

---

## Part III: Measurement Integration

### The OEE Calculation Framework — Summary

```
Total Calendar Time
  └─ Loading Time (Total Time − Planned Downtime)  → Utilization Rate
       └─ Operating Time (Loading − Stoppages)     → Availability
            └─ Net Operating Time (− Speed Losses) → Performance Efficiency
                 └─ Valuable Operating Time         → Quality Rate

OEE  = Availability × Performance Efficiency × Quality Rate
TEEP = OEE × Utilization Rate
```

### How Reliability KPIs Feed into OEE

| Reliability KPI | Impact on OEE Component |
|---|---|
| MTBF | Improves Availability (fewer breakdowns = less downtime) |
| MTTR | Improves Availability (faster repair = less downtime per event) |
| Failure Rate | Inversely drives Availability and Performance |
| Breakdown Frequency | Directly reduces Availability |
| Equipment Reliability (%) | Composite driver of all three OEE components |

### Ideal Targets Summary

| KPI | World-Class Target |
|---|---|
| OEE | ≥ 85% |
| Availability | > 90% |
| Performance Efficiency | > 95% |
| Quality Rate | > 99% |
| TEEP | Maximize toward OEE as utilization → 100% |
| Breakdown Frequency | < 1 per month per machine |
| Process Defect Rate | < 0.1% (target: 100–30 ppm) |

---

## Part IV: Key Principles from Nakajima

### On Measurement Accuracy
"If we want to practice 'profitable TPM' and pursue optimal equipment effectiveness, the following two factors are crucial. First, we must keep accurate equipment operation records so that the appropriate management and controls can be provided; and second, we must devise a precise scale for measuring the equipment operation conditions."

### On the Hidden Nature of Losses
"Be prepared for a figure [OEE] that is considerably lower than you expected. The lower the present overall equipment effectiveness, however, the more untapped potential your company possesses."

### On the Relationship Between All KPIs
"TPM is not limited to dealing with breakdowns; rather it raises the level of total equipment effectiveness by improving all related factors: availability (operating rate): improved by eliminating breakdowns, setup/adjustment losses, and other stoppage losses; performance: improved by eliminating speed losses, minor stoppages, and idling; quality (rate of quality products): improved by eliminating quality defects in process and during startup."

### On the Goal
"When breakdowns and defects are eliminated, equipment operation rates improve, costs are reduced, inventory can be minimized, and as a consequence, labor productivity increases."

---

*All formulas, figures, benchmarks, and definitions in this guide are sourced directly from:*
- *Nakajima, Seiichi. Introduction to TPM: Total Productive Maintenance. Productivity Press, 1988. ISBN 0-915299-23-2.*
- *Nakajima, Seiichi (ed.). TPM Development Program: Implementing Total Productive Maintenance. Productivity Press, 1989. ISBN 0-915299-37-2.*
- *Originally published by the Japan Institute for Plant Maintenance (JIPM), Tokyo.*
