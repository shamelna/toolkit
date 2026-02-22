# 📐 VSM Calculation Guide — Learning to See

A complete reference of every calculation and formula from *Learning to See* by Mike Rother & John Shook, organized logically with worked examples from the Acme Stamping and TWI Industries case studies.

---

# Part 1 — Foundation: Demand & Tempo

These calculations establish the fundamental rhythm of production. Everything else builds on them.

## 1.1 Available Working Time

```
Available Time = Total Shift Time − Breaks − Other Non-Working Time
```

**Acme Stamping Example** *(pp. 58–59)*

| Input | Value |
| --- | --- |
| Total shift time | 8 hours = 28,800 sec |
| Breaks (2 × 10 min) | 1,200 sec |
| **Available time per shift** | **28,800 − 1,200 = 27,600 sec** |

**TWI Industries Example** *(p. 46)*

| Input | Value |
| --- | --- |
| Total shift time | 8 hours = 28,800 sec |
| Breaks (2 × 15 min) | 1,800 sec |
| **Available time per shift** | **28,800 − 1,800 = 27,000 sec** |

## 1.2 Customer Demand Rate

```
Daily Demand = Monthly Demand ÷ Working Days per Month
```

```
Demand per Shift = Daily Demand ÷ Number of Shifts
```

**Acme Stamping Example** *(pp. 58–59)*

| Step | Calculation | Result |
| --- | --- | --- |
| Monthly demand | 12,000 LH + 6,400 RH | 18,400 pcs/month |
| Working days |  | 20 days/month |
| Daily demand | 18,400 ÷ 20 | **920 pcs/day** |
| Shifts per day |  | 2 |
| Demand per shift | 920 ÷ 2 | **460 pcs/shift** |

**TWI Industries** *(p. 45)*

| Step | Calculation | Result |
| --- | --- | --- |
| Monthly demand |  | 24,000 pcs/month |
| Daily demand | 24,000 ÷ 20 | **1,200 pcs/day** |
| Demand per shift | 1,200 ÷ 2 | **600 pcs/shift** |
|  |  |  |

## 1.3 Takt Time

```jsx
Takt Time = Available Working Time per Shift ÷ Customer Demand per Shift
```

Takt time synchronizes the pace of production to the pace of sales *(p. 44)*.

**Generic Example** *(p. 44)*

```jsx
Takt = 27,000 sec ÷ 455 pcs = 59.3 seconds
```

**Acme Stamping** *(p. 59)*

```jsx
Takt = 27,600 sec ÷ 460 pcs = 60 seconds
```

This means Acme must produce one steering bracket every 60 seconds to match customer demand. This number "includes no time for equipment downtime, changeovers… or for producing scrap" *(p. 59)*.

**TWI Industries** *(implied, pp. 107–108)*

```jsx
Takt = 27,000 sec ÷ 600 pcs = 45 seconds
```

---

# Part 2 — Current State Analysis

These calculations describe how the value stream performs today.

## 2.1 Process Data Boxes

Each process on the map records key metrics in a data box *(pp. 21–22)*:

| Metric | Abbreviation | What It Means |
| --- | --- | --- |
| Cycle Time | C/T | Time between one part and the next coming off the process |
| Changeover Time | C/O | Time to switch from one product variant to another |
| Uptime | % | On-demand machine availability |
| EPE | Every Part Every ___ | Measure of production batch size |
| Number of Operators |  | People required to run the process |
| Available Time | sec | Working time per shift minus breaks |
| Scrap Rate | % | Percentage of defective output |

**Acme Stamping — All Process Data** *(pp. 33–35, 119)*

| Process | C/T | C/O | Uptime | Operators | EPE |
| --- | --- | --- | --- | --- | --- |
| Stamping (200T press) | 1 sec | 1 hour | 85% | 1 | 2 weeks |
| Spot Weld #1 | 39 sec | 10 min | 100% | 1 | — |
| Spot Weld #2 | 46 sec | 10 min | 80% | 1 | — |
| Assembly #1 | 62 sec | 0 | 100% | 1 | — |
| Assembly #2 | 40 sec | 0 | 100% | 1 | — |

## 2.2 Process Capacity

```
Capacity = (Available Time ÷ Cycle Time) × Uptime %
```

This is implicit on p. 22: "available work time divided by cycle time multiplied by uptime percent is a measure of current process capacity, if no changeovers are made."

**Acme Stamping Examples:**

| Process | Available | C/T | Uptime | Capacity |
| --- | --- | --- | --- | --- |
| Stamping | 27,600 sec | 1 sec | 85% | `(27,600 ÷ 1) × 0.85 = 23,460 pcs` |
| Weld #1 | 27,600 sec | 39 sec | 100% | `(27,600 ÷ 39) × 1.00 = 708 pcs` |
| Weld #2 | 27,600 sec | 46 sec | 80% | `(27,600 ÷ 46) × 0.80 = 480 pcs` |
| Assembly #1 | 27,600 sec | 62 sec | 100% | `(27,600 ÷ 62) × 1.00 = 445 pcs` |
| Assembly #2 | 27,600 sec | 40 sec | 100% | `(27,600 ÷ 40) × 1.00 = 690 pcs` |

Assembly #1 is the bottleneck at 445 pcs/shift vs. 460 demand — a gap that must be addressed.

## 2.3 Inventory Conversion: Pieces to Days

```
Inventory (days) = Inventory Quantity ÷ Daily Customer Demand
```

"Lead times (in days) for each inventory triangle are calculated as follows: inventory quantity divided by the daily customer requirement" *(p. 35)*.

**Acme Stamping — All Inventory Points** *(pp. 33–35)*

Daily customer requirement = **920 pcs/day**

| Location | LH Pcs | RH Pcs | Total | Calculation | Days |
| --- | --- | --- | --- | --- | --- |
| Raw coils | — | — | — | (observed) | **5.0** |
| After Stamping | 4,600 | 2,400 | 7,000 | 7,000 ÷ 920 | **7.6** |
| After Weld #1 | 1,100 | 600 | 1,700 | 1,700 ÷ 920 | **1.8** |
| After Weld #2 | 1,600 | 850 | 2,450 | 2,450 ÷ 920 | **2.7** |
| After Assembly #1 | 1,200 | 640 | 1,840 | 1,840 ÷ 920 | **2.0** |
| Finished Goods | 2,700 | 1,440 | 4,140 | 4,140 ÷ 920 | **4.5** |

## 2.4 Production Lead Time

```
Production Lead Time = Sum of all inventory days across the value stream
```

**Acme Current State Timeline** *(p. 35)*

| Coils | Stamped | Post-W1 | Post-W2 | Post-A1 | FG | **Total** |
| --- | --- | --- | --- | --- | --- | --- |
| 5.0 | 7.6 | 1.8 | 2.7 | 2.0 | 4.5 | **23.6 days** |

## 2.5 Total Value-Added Time

```
VA Time = Sum of all process cycle times
```

**Acme:** `1 + 39 + 46 + 62 + 40 = 188 seconds`

## 2.6 VA % and NVA % — The "Shock" Ratio

```
VA % = Total Processing Time ÷ (Production Lead Time × 86,400 sec/day)
```

```
NVA % = 1 − VA %
```

This is the central insight of the value stream map — how little of the total lead time is actual processing.

**Acme Current State:**

`VA% = 188 sec ÷ (23.6 days × 86,400 sec/day) = 188 ÷ 2,038,400 = 0.0092%`

**~99.99% of the time is non-value-added.** The part sits waiting for 23.6 days but is only being worked on for 188 seconds.

---

# Part 3 — Future State Design

These calculations drive the redesign of the value stream.

## 3.1 Operators Needed for a Cell

```
Operators Needed = Total Work Content ÷ Takt Time
```

"Dividing the total welding and assembly work content by the takt time" *(p. 63)*.

**Acme Weld/Assembly Cell** *(pp. 63–64)*

| Step | Cycle Time |
| --- | --- |
| Weld #1 | 39 sec |
| Weld #2 | 46 sec |
| Assembly #1 | 62 sec |
| Assembly #2 | 40 sec |
| **Total Work Content** | **187 sec** |

`Operators = 187 sec ÷ 60 sec takt = 3.12 → 4 operators (round up)`

Four operators would be underutilized. The kaizen target:

```
Max Work per Operator = Takt Time − Buffer (e.g., 4 sec)
```

```
Target Total Work = Operators × Max Work
```

| Item | Calculation | Result |
| --- | --- | --- |
| Target operators |  | 3 |
| Max work per operator | 60 − 4 sec buffer | 56 sec |
| Target total work | 3 × 56 | **168 sec** |
| Waste to eliminate | 187 − 168 | **19 seconds** |

**TWI Assembly Cell** *(p. 108)*

`Operators = 195 sec ÷ 45 sec takt = 4.33 → 5 operators`

## 3.2 Cycle Time vs. Takt — When C/T Must Be Faster

When a process requires changeovers, it must cycle faster than takt to leave time for setups.

```
Time Remaining = Available Time − (Demand × Actual C/T)
```

```
Changeovers per Shift = Time Remaining ÷ C/O Duration
```

**TWI Weld/Deflash** *(pp. 107–108)* — Why C/T = 39 sec, not 45 sec takt:

| Step | Calculation | Result |
| --- | --- | --- |
| Demand per shift |  | 600 pcs |
| If C/T = Takt (45 sec) | 600 × 45 | 27,000 sec = ALL available time |
| No time left for changeovers! |  |  |
| Actual C/T chosen |  | 39 sec |
| Run time at 39 sec | 600 × 39 | 23,400 sec |
| Time remaining | 27,000 − 23,400 | **3,600 sec (1 hour)** |
| C/O target |  | 300 sec (5 min) |
| Changeovers per shift | 3,600 ÷ 300 | **12 changeovers** |

---

# Part 4 — Pull Systems & Supermarkets

## 4.1 Kanban Sizing

```
Kanban per Shift = Demand per Shift ÷ Container Quantity
```

**Acme Finished Goods** *(p. 61)*

`Kanban/shift = 460 pcs ÷ 20 pcs/tray = 23 kanban per shift`

## 4.2 Container Size as Time

```
Time per Container = Container Quantity × Takt Time
```

**Acme Stamped-Parts Bins** *(p. 67)*

`Time per bin = 60 pcs × 60 sec = 3,600 sec = 60 minutes`

The book describes this as "about one hour of current steering bracket assembly."

## 4.3 Supermarket Sizing

```
Supermarket Size = EPE Demand + Safety Buffer
```

**Acme Stamped-Parts Supermarket** *(pp. 67–68)*

| Item | Value | Notes |
| --- | --- | --- |
| EPE target | 1 day |  |
| LH daily demand | 600 pcs |  |
| RH daily demand | 320 pcs |  |
| Buffer | +0.5 day | For replenishment delay and stamping problems |
| **Total supermarket** | **1.5 days** |  |
| LH stock | 600 × 1.5 = 900 pcs |  |
| RH stock | 320 × 1.5 = 480 pcs |  |

## 4.4 Signal Kanban Trigger

When bin-for-bin pull is impractical (due to long changeovers), a signal kanban triggers a batch.

```
Feasibility: C/O-to-Run % = C/O Time ÷ (C/O Time + Run Time)
```

**Acme Stamping — Why Bin-for-Bin Fails** *(p. 68)*

| Item | Value |
| --- | --- |
| Bin size | 60 pcs |
| Run time for 1 bin | 60 × 1 sec = 60 sec |
| Changeover time | 3,600 sec (1 hour) |
| C/O as % of total | `3,600 ÷ (3,600 + 60) = 98.4%` |

Setup time completely dominates — producing 60-piece bins one at a time is impractical. The signal kanban triggers a full daily batch instead (600 LH or 320 RH).

---

# Part 5 — Scheduling & Leveling

## 5.1 Pitch

```
Pitch = Takt Time × Pack-Out Quantity
```

Pitch is "the basic unit of your production schedule for a product family" *(p. 51)*.

**Generic Example** *(p. 51)*

`Pitch = 30 sec × 20 pcs = 600 sec = 10 minutes`

**Acme Stamping** *(p. 76)*

`Pitch = 60 sec × 20 pcs/tray = 1,200 sec = 20 minutes`

**TWI Industries** *(p. 108)*

`Pitch = 39 sec × 50 pcs (avg order) + 300 sec C/O ≈ 30 minutes`

## 5.2 Load-Leveling Box

```
Columns in Leveling Box = Available Time per Shift ÷ Pitch
```

**Acme Stamping:**

`Columns = 27,600 sec ÷ 1,200 sec = 23 columns`

Rows = number of product variants (2 for Acme: LH and RH).

## 5.3 Mix Leveling Pattern

```
Mix Ratio = LH Quantity ÷ RH Quantity → Repeating Pattern
```

**Acme Stamping** *(pp. 73–74)*

| Item | Value |
| --- | --- |
| LH trays per day | 600 ÷ 20 = 30 trays |
| RH trays per day | 320 ÷ 20 = 16 trays |
| LH:RH ratio | `30 ÷ 16 = 1.875 : 1` |
| Simplified pattern | **R L L R L L R L L …** |

Instead of batching (30 LH then 16 RH), alternate in a repeating pattern. Every 3 trays: 2 LH + 1 RH.

- **Batched:** `LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLRRRRRRRRRRRRRRRR`
- **Leveled:** `RLLRLLRLLRLLRLLRLLRLLRLLRLLRLLRLLRLLRLLRLLRLLR`

---

# Part 6 — Batch Sizing & EPE

## 6.1 Current Batch Size from EPE

```
Batch Size = EPE Interval (days) × Daily Demand
```

**Acme Current State** — EPE = 2 weeks:

| Variant | EPE | Daily Demand | Batch Size |
| --- | --- | --- | --- |
| LH | 10 days | 600 pcs | **6,000 pcs** |
| RH | 10 days | 320 pcs | **3,200 pcs** |

## 6.2 Target Batch Size (EPE = 1 day)

**Acme Future State — Intermediate** *(p. 68)*

| Variant | Batch Size |
| --- | --- |
| LH | 600 pcs (1 day) |
| RH | 320 pcs (1 day) |

## 6.3 Target Batch Size (EPE = 1 shift)

**Acme Future State — Final** *(p. 77)*

| Variant | Batch Size |
| --- | --- |
| LH | 300 pcs (1 shift) |
| RH | 160 pcs (1 shift) |

## 6.4 Inventory Reduction from Smaller Batches

```
Reduction % = 1 − (New Batch ÷ Old Batch)
```

`Reduction = 1 − (300 ÷ 6,000) = 1 − 0.05 = 95%`

The book states "about 85 percent" *(p. 77)* — the difference accounts for the supermarket buffer held beyond the batch itself.

## 6.5 Changeover Budget Method

```
Time for C/O = Available Time − Time to Run Daily Demand
```

```
Max Changeovers = Time for C/O ÷ C/O Duration per Setup
```

"A typical target is approximately 10% of available time to be used for changeovers" *(p. 54)*.

**Generic Example** *(p. 54)*

| Step | Calculation | Result |
| --- | --- | --- |
| Available time/day |  | 16 hours |
| Time to run daily demand |  | 14.5 hours |
| Time left for C/O | 16 − 14.5 | **1.5 hours** |
| C/O duration per setup |  | 15 min (0.25 hr) |
| Max changeovers | 1.5 ÷ 0.25 | **6 per day** |

---

# Part 7 — Supplier Integration

## 7.1 Delivery Frequency Improvement

```
Inventory Reduction = 1 − (New Inventory Days ÷ Old Inventory Days)
```

**Acme Coil Supply** *(p. 69)*

| Item | Current | Future |
| --- | --- | --- |
| Delivery frequency | 2× per week (Tue/Thu) | Daily (milk run) |
| Coil inventory | 5 days | 1.5 days |
| Reduction |  | `1 − (1.5 ÷ 5) = 70%` |

The book notes: "Simply moving to daily delivery eliminates 80% of the inventory at Acme" *(p. 69)*. The difference is because ideal daily delivery would need only 1 day of stock.

## 7.2 Scrap Adjustment to Demand

Scrap rate is listed as a data box metric *(p. 21)* and shown as "2% Scrap" in the icon examples *(p. 108)*. Acme does not apply it, but the implicit formula is:

`Gross Demand = Net Demand ÷ (1 − Scrap Rate)`

`Gross Demand = 460 pcs ÷ (1 − 0.02) = 469.4 pcs/shift`

You must produce more than the customer needs to account for scrap.

---

# Part 8 — Performance Metrics & Comparison

## 8.1 Three-State Lead Time Comparison

**Acme Stamping** *(pp. 69–70, 80–81)*

| State | Coils | Stamped | WIP | FG | Lead Time |
| --- | --- | --- | --- | --- | --- |
| **Current** | 5.0 d | 7.6 d | 6.5 d | 4.5 d | **23.6 days** |
| **Flow & Pull** | 2.0 d | 1.5 d | 0 d | 4.5 d | **8.0 days** |
| **With Leveling** | 1.5 d | 1.0 d | 0 d | 2.0 d | **4.5 days** |

## 8.2 Inventory Turns

`Inventory Turns ≈ Working Days per Year ÷ Production Lead Time (days)`

| State | Lead Time | Turns |
| --- | --- | --- |
| Current | 23.6 days | `240 ÷ 23.6 ≈ 10` |
| Flow & Pull | 8.0 days | `240 ÷ 8.0 = 30` |
| With Leveling | 4.5 days | `240 ÷ 4.5 ≈ 53` |

## 8.3 Lead Time Reduction

`Reduction % = (Current − Future) ÷ Current`

`Reduction = (23.6 − 4.5) ÷ 23.6 = 80.9%`

## 8.4 VA % Improvement

| State | VA Time | Lead Time | VA % |
| --- | --- | --- | --- |
| Current | 188 sec | 23.6 days | 0.0092% |
| Future | 169 sec | 4.5 days | 0.0435% |

VA % improves by ~4.7x — but remains extremely small, showing that even the future state has further to go.

---

# Part 9 — TWI Industries Summary

**TWI Current State** *(Appendix B, p. 111)*

| Inventory Point | Days |
| --- | --- |
| Raw rods | 20 |
| Cut rods | 5 |
| Post-Weld #1 | 3 |
| Post-Weld #2 | 3 |
| Post-Deflash | 5 |
| At painter (outside) | 2 |
| Painted at TWI | 6 |
| Finished goods | 4 |
| Raw forgings | 20 |
| Machined forgings | 4 |
| **Total lead time** | **approx 43+ days** |

**TWI Future State Key Calculations** *(pp. 107–108)*

| Metric | Calculation | Result |
| --- | --- | --- |
| Takt time | `27,000 ÷ 600` | 45 sec |
| Weld/Deflash C/T | (faster for C/O room) | 39 sec |
| Run time per shift | `600 × 39` | 23,400 sec |
| Time for C/Os | `27,000 − 23,400` | 3,600 sec (1 hr) |
| C/O target |  | 300 sec (5 min) |
| C/Os per shift | `3,600 ÷ 300` | 12 |
| Assembly operators | `195 ÷ 45 → round up` | 5 operators |
| Pitch | `50 pcs × 39 sec + 300 sec` | ~30 min |
| Future lead time |  | **< 11 days** |

---

# Part 10 — Complete Formula Reference

| # | Formula Name | Expression | Page |
| --- | --- | --- | --- |
| 1 | Available Time | `Total Shift − Breaks` | p. 59 |
| 2 | Daily Demand | `Monthly Demand ÷ Working Days` | p. 58 |
| 3 | Demand per Shift | `Daily Demand ÷ Shifts` | p. 58 |
| 4 | Takt Time | `Available Time ÷ Demand per Shift` | p. 44 |
| 5 | Process Capacity | `(Available ÷ C/T) × Uptime` | p. 22 |
| 6 | Inventory Days | `Quantity ÷ Daily Demand` | p. 35 |
| 7 | Production Lead Time | `Sum of all inventory days` | p. 35 |
| 8 | VA Time | `Sum of process cycle times` | p. 35 |
| 9 | VA % | `Processing Time ÷ Lead Time (in sec)` | p. 35 |
| 10 | NVA % | `1 − VA %` | p. 35 |
| 11 | Operators Needed | `Total Work Content ÷ Takt` | p. 63 |
| 12 | Max Work / Operator | `Takt − Buffer` | p. 64 |
| 13 | Pitch | `Takt × Pack-Out Quantity` | p. 51 |
| 14 | Kanban per Shift | `Demand ÷ Container Qty` | p. 61 |
| 15 | Leveling Box Columns | `Available Time ÷ Pitch` | p. 53 |
| 16 | Mix Ratio | `LH Qty ÷ RH Qty` | p. 73 |
| 17 | Batch Size (EPE) | `EPE Interval × Daily Demand` | p. 77 |
| 18 | C/O Budget | `Available − Run Time` | p. 54 |
| 19 | Max Changeovers | `C/O Budget ÷ C/O Duration` | p. 54 |
| 20 | Supermarket Size | `EPE Demand + Safety Buffer` | p. 68 |
| 21 | Container as Time | `Container Qty × Takt` | p. 67 |
| 22 | Signal Kanban Check | `C/O ÷ (C/O + Run Time)` | p. 68 |
| 23 | Inventory Turns | `Working Days/Year ÷ Lead Time` | p. 69 |
| 24 | Lead Time Reduction | `(Current − Future) ÷ Current` | p. 81 |
| 25 | Gross Demand (Scrap) | `Net Demand ÷ (1 − Scrap Rate)` | p. 59 |
| 26 | Delivery Inv. Reduction | `1 − (New Inv ÷ Old Inv)` | p. 69 |
| 27 | Cell C/T Target | `Target Work Content ÷ Operators` | p. 64 |
| 28 | C/Os per Shift | `Time Remaining ÷ C/O Duration` | p. 108 |

---

*Source: Learning to See — Value Stream Mapping to Add Value and Eliminate MUDA, by Mike Rother and John Shook (Lean Enterprise Institute, 1999)*