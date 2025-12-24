# Emotional Barometer UI

Interface components for tracking and responding to emotional intensity.

## Inline Check (Always Visible)

A minimal, always-present indicator in the input area:

```mermaid
flowchart TB
    subgraph InlineCheck[Inline Emotion Check]
        subgraph Compact[Compact View]
            Label[Feeling:]
            Value[5]
            Indicator[Small visual indicator]
            Expand[Tap to adjust]
        end
    end
```

This appears in the input bar and can be tapped to expand.

## Expanded Slider

```mermaid
flowchart TB
    subgraph ExpandedSlider[Expanded Emotion Slider]
        Question[How are you feeling right now?]

        subgraph SliderArea[Slider]
            LeftLabel[1 Calm]
            SliderTrack[----------O----------]
            RightLabel[10 Intense]
        end

        subgraph Descriptions[Zone Descriptions]
            ZoneDesc[Currently: Moderately elevated]
        end

        Confirm[Done]
    end
```

## Zone Styling

| Range | Color | Description |
|-------|-------|-------------|
| 1-4 | Calm blue/green | Calm and regulated |
| 5-7 | Warm yellow | Elevated but manageable |
| 8-10 | Soft coral | High intensity |

## Periodic Prompt

The AI occasionally prompts for an emotion check:

```mermaid
flowchart TB
    subgraph PeriodicPrompt[Emotion Check Prompt]
        subgraph AIMessage[AI Message]
            PromptText[Before we continue - how are you
            feeling right now?]
        end

        subgraph QuickSelect[Quick Selection]
            Low[1-3 Calm]
            Mid[4-6 Mixed]
            High[7-10 Intense]
        end

        subgraph OrSlider[Or use slider]
            FullSlider[Detailed slider]
        end
    end
```

## Cooling Period Interface

When intensity exceeds threshold:

### Initial Trigger

```mermaid
flowchart TB
    subgraph CoolingTrigger[Cooling Period Triggered]
        Icon[Calming illustration]
        Title[Taking a moment]
        Message[I notice your emotions are running
        high right now. That makes complete
        sense given what you are working through.]
        Validation[There is no rush. Your wellbeing
        matters more than progress.]
    end
```

### Options Screen

```mermaid
flowchart TB
    subgraph CoolingOptions[Cooling Period Options]
        OptionsTitle[What might help right now?]

        subgraph OptionCards[Option Cards]
            subgraph Card1[Breathing]
                B1Icon[Breath icon]
                B1Title[Breathing exercise]
                B1Desc[2 minute guided breathing]
            end

            subgraph Card2[Break]
                B2Icon[Clock icon]
                B2Title[Take a break]
                B2Desc[Come back when ready]
            end

            subgraph Card3[Journal]
                B3Icon[Pen icon]
                B3Title[Private journaling]
                B3Desc[Write without sharing]
            end

            subgraph Card4[Ground]
                B4Icon[Feet icon]
                B4Title[Grounding exercise]
                B4Desc[1 minute body scan]
            end
        end

        Ready[I am ready to continue]
    end
```

### Breathing Exercise Screen

```mermaid
flowchart TB
    subgraph BreathingExercise[Guided Breathing]
        Circle[Animated breathing circle]
        Instruction[Breathe in... 4 seconds]
        Progress[Round 2 of 4]
        Skip[End early]
    end
```

Animation sequence:
1. Circle expands: "Breathe in" (4 seconds)
2. Circle holds: "Hold" (7 seconds)
3. Circle contracts: "Breathe out" (8 seconds)
4. Repeat 4 times

### Return Check

```mermaid
flowchart TB
    subgraph ReturnCheck[Ready to Return]
        ReturnTitle[Ready to continue?]
        ReturnQuestion[How are you feeling now?]
        ReturnSlider[1 -------- 5 -------- 10]

        ReturnResult{Intensity}
        ReturnResult -->|Still high| MoreSupport[More time or support]
        ReturnResult -->|Lowered| Continue[Return to session]
    end
```

## Trend Visualization (Optional)

For multi-session users, show emotional trends:

```mermaid
flowchart TB
    subgraph TrendView[Emotion Trend]
        TrendTitle[Your emotional journey]

        subgraph Graph[Session Graph]
            S1[Session 1: Avg 7]
            S2[Session 2: Avg 6]
            S3[Session 3: Avg 5]
            S4[Session 4: Avg 4]
            TrendLine[Downward trend line]
        end

        TrendInsight[Your intensity has been
        decreasing over time]
    end
```

## Private Journaling Interface

```mermaid
flowchart TB
    subgraph JournalInterface[Private Journal]
        JournalHeader[Private Space]
        JournalNote[This will not be shared]

        JournalArea[Large text area for writing
        No character limit
        No AI interaction
        Pure private space]

        JournalActions[Save privately - Return to session]
    end
```

## Mobile Adaptations

### Compact Mobile Emotion Check

```mermaid
flowchart LR
    subgraph MobileCompact[Mobile Compact]
        MEmoIcon[Emotion icon]
        MValue[5]
        MTap[Tap]
    end
```

### Mobile Full Screen Cooling

On mobile, cooling period takes full screen:

```mermaid
flowchart TB
    subgraph MobileCooling[Mobile Cooling Screen]
        MCIcon[Full illustration]
        MCTitle[Taking a moment]
        MCMessage[Supportive message]
        MCOptions[Stacked option buttons]
        MCReady[Ready button at bottom]
    end
```

## Accessibility Considerations

| Feature | Implementation |
|---------|---------------|
| Color-blind friendly | Icons and labels, not just color |
| Screen reader | Descriptive labels for all states |
| Keyboard navigation | Full keyboard control of slider |
| Reduced motion | Option to disable animations |
| High contrast | Sufficient contrast in all states |

---

## Related Documents

- [Emotional Barometer Mechanism](../mechanisms/emotional-barometer.md)
- [Chat Interface](./chat-interface.md)
- [Core Layout](./core-layout.md)

---

[Back to Wireframes](./index.md) | [Back to Plans](../index.md)
