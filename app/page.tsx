"use client";

import { useMemo, useState } from "react";

type Screen =
  | "landing"
  | "intro"
  | "q1"
  | "q2"
  | "q2b"
  | "q3"
  | "q4"
  | "q5"
  | "branch1"
  | "branch2"
  | "branch3"
  | "q9"
  | "q10"
  | "loading"
  | "result"
  | "paywall"
  | "fullPlan";

type Answers = {
  businessType: string;
  revenue: string;
  businessAge: string;
  finance: string;
  teamSize: string;
  constraint: string;
  branch1: string;
  branch2: string;
  branch3: string;
  offer: string;
  priority: string;
  email: string;
};

function Shell({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  progress,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  progress: number;
}) {
  return (
    <div className="app-shell">
      <div className="container narrow">
        <div className="progress-wrap">
          <div className="progress-top">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{progress}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="question-card fade-in">
          <h1 className="question-title">{title}</h1>
          {subtitle ? <p className="question-subtitle">{subtitle}</p> : null}
          <div className="stack">{children}</div>
        </div>
      </div>
    </div>
  );
}

function OptionButtons({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="stack">
      {options.map((option) => (
        <button key={option} className="option-button" onClick={() => onSelect(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

function TextInputScreen({
  value,
  onChange,
  onContinue,
  placeholder,
  buttonLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  placeholder: string;
  buttonLabel?: string;
}) {
  return (
    <div className="stack">
      <textarea
        className="text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button className="primary-button" disabled={!value.trim()} onClick={onContinue}>
        {buttonLabel || "Continue"}
      </button>
    </div>
  );
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("landing");
    const [answers, setAnswers] = useState<Answers>({
    businessType: "",
    revenue: "",
    businessAge: "",
    finance: "",
    teamSize: "",
    constraint: "",
    branch1: "",
    branch2: "",
    branch3: "",
    offer: "",
    priority: "",
    email: "",
  });

  const branchSteps = useMemo(() => {
    if (answers.constraint === "Not enough leads") return ["branch1", "branch2", "branch3"];
    if (answers.constraint === "Leads but not converting")
      return ["branch1", "branch2", "branch3"];
    if (answers.constraint === "Customers not coming back") return ["branch1", "branch2"];
    if (answers.constraint === "Operations are messy or inefficient")
      return ["branch1", "branch2"];
    if (answers.constraint === "I am not sure") return ["branch1"];
    return [];
  }, [answers.constraint]);

    const questionFlow = useMemo(() => {
    return ["q1", "q2", "q2b", "q3", "q4", "q5", ...branchSteps, "q9", "q10"];
  }, [branchSteps]);

  const currentIndex = Math.max(questionFlow.indexOf(screen), 0);
  const currentStep = currentIndex + 1;
  const totalSteps = questionFlow.length || 1;
  const progress = Math.round((currentStep / totalSteps) * 100);

  function nextFrom(current: string) {
    const index = questionFlow.indexOf(current);
    if (index === -1 || index === questionFlow.length - 1) {
      setScreen("loading");
      setTimeout(() => setScreen("result"), 1500);
      return;
    }
    setScreen(questionFlow[index + 1] as Screen);
  }

  function setValue(key: keyof Answers, value: string, current: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));

    if (key === "constraint") {
      setScreen("branch1");
      return;
    }

    nextFrom(current);
  }

  function getVisibleInsight() {
    if (answers.constraint === "Not enough leads") {
      return {
        title: "Your pipeline depends too much on chance",
        text:
          "Right now, new business looks too dependent on referrals, inconsistent outreach, or activity you do not fully control. That makes revenue harder to predict. The fastest move is to build one reliable source of demand you own. Start with your last 10 customers. Ask for reviews or referrals within the next 48 hours and use that as the first layer of a repeatable lead system.",
      };
    }

    if (answers.constraint === "Leads but not converting") {
      return {
        title: "You are getting interest, but the handoff is weak",
        text:
          "This does not look like an awareness problem first. It looks like a conversion problem. People are close enough to consider buying, but something in your process is making them stall, hesitate, or disappear. The fastest move is to tighten the single step where momentum dies. Fix that before trying to drive more leads into the same leak.",
      };
    }

    if (answers.constraint === "Customers not coming back") {
      return {
        title: "You are underusing the relationship after the first sale",
        text:
          "Right now, too much value may be getting left behind after someone buys once. That usually means weak follow up, weak reactivation, or no clear reason to return. The quickest improvement is to create one simple follow up that gives people a reason to buy again or refer someone while the experience is still fresh.",
      };
    }

    if (answers.constraint === "Operations are messy or inefficient") {
      return {
        title: "The business is running, but the system underneath it is messy",
        text:
          "The issue is not effort. It is drag. If your time keeps disappearing into admin, reactive work, or repeated fixes, growth gets capped by how much chaos you can personally absorb. The fastest improvement is to identify one recurring task that keeps breaking and document a clean process for it this week.",
      };
    }

    return {
      title: "Your first priority is clarity, not another tactic",
      text:
        "Right now, the biggest issue is that the real bottleneck is not fully visible yet. That is normal, but it means guessing at solutions will waste time. The fastest move is to track your last 10 leads or customers, note where they came from, what happened next, and where momentum dropped. That will show you what actually needs fixing.",
    };
  }

  const insight = getVisibleInsight();

  if (screen === "landing") {
    return (
      <>
        <div className="app-shell">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Clarity Audit</div>
              <h1 className="hero-title">
                Fix your biggest
                <br />
                business bottleneck
                <br />
                in 2 minutes
              </h1>
              <p className="hero-copy">
                Answer a few quick questions and get a clear, useful insight based on how your
                business actually works.
              </p>
              <div className="button-row">
                <button className="primary-button" onClick={() => setScreen("intro")}>
                  Start free audit
                </button>
                <button className="secondary-button">See example result</button>
              </div>
              <div className="meta-row">
                <div className="meta-pill">No signup required</div>
                <div className="meta-pill">Takes about 2 minutes</div>
                <div className="meta-pill">Built for real businesses</div>
              </div>
            </div>

            <div className="panel big-panel fade-in">
              <div className="small-label">What you get</div>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>A clearer view of what is actually slowing your business down</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>One free insight you can act on immediately</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>The option to unlock a fuller plan if it hits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  if (screen === "intro") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="intro-card fade-in">
              <div className="small-label">Before we start</div>
              <h1>This is not a generic questionnaire</h1>
              <p>
                We are going to ask a few quick questions to understand how your business operates.
                Your answers shape the result directly, so the more accurate you are, the better the
                insight will be.
              </p>
              <div className="button-row">
                <button className="primary-button" onClick={() => setScreen("q1")}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  if (screen === "q1") {
    return (
      <>
        <Shell
          title="Which best describes your business and how you make money?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Service based projects or one off work",
              "Service based retainers or recurring work",
              "Product or ecommerce",
              "SaaS or subscription",
              "Local business",
              "Agency",
              "Other",
            ]}
            onSelect={(value) => setValue("businessType", value, "q1")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

    if (screen === "q2") {
    return (
      <>
        <Shell
          title="What best describes your current monthly revenue?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Pre revenue",
              "Up to £10k per month",
              "£10k to £50k per month",
              "£50k to £250k per month",
              "£250k plus per month",
            ]}
            onSelect={(value) => setValue("revenue", value, "q2")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

    if (screen === "q2b") {
    return (
      <>
        <Shell
          title="How long has the business been operating?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Under 6 months",
              "6 to 12 months",
              "1 to 3 years",
              "3 to 5 years",
              "5 plus years",
            ]}
            onSelect={(value) => setValue("businessAge", value, "q2b")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "q3") {
    return (
      <>
        <Shell
          title="Which best describes your current financial situation?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Profitable and stable",
              "Profitable but inconsistent",
              "Break even",
              "Losing money or investing to grow",
              "Not sure",
            ]}
            onSelect={(value) => setValue("finance", value, "q3")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "q4") {
    return (
      <>
        <Shell
          title="How big is your team right now?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={["Just me", "2 to 5", "6 to 20", "20 plus"]}
            onSelect={(value) => setValue("teamSize", value, "q4")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "q5") {
    return (
      <>
        <Shell
          title="What is currently limiting your growth the most?"
          subtitle="Pick the one that feels most true today."
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Not enough leads",
              "Leads but not converting",
              "Customers not coming back",
              "Operations are messy or inefficient",
              "I am not sure",
            ]}
            onSelect={(value) => setValue("constraint", value, "q5")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "branch1") {
    if (answers.constraint === "Not enough leads") {
      return (
        <>
          <Shell
            title="Where do your customers come from, and how consistent is that flow?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "Paid ads and consistent",
                "Paid ads and inconsistent",
                "Organic or content",
                "Referrals or word of mouth",
                "Outbound",
                "Not consistent or unpredictable",
              ]}
              onSelect={(value) => setValue("branch1", value, "branch1")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    if (answers.constraint === "Leads but not converting") {
      return (
        <>
          <Shell
            title="How does a lead become a customer in your business?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "Direct purchase with no sales process",
                "Short process with 1 or 2 steps",
                "Sales call required",
                "Multi step process",
                "Not clearly defined",
              ]}
              onSelect={(value) => setValue("branch1", value, "branch1")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    if (answers.constraint === "Customers not coming back") {
      return (
        <>
          <Shell
            title="What typically happens after someone buys from you?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "One time purchase only",
                "Occasional repeat customers",
                "Strong repeat business",
                "Ongoing relationship",
              ]}
              onSelect={(value) => setValue("branch1", value, "branch1")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    if (answers.constraint === "Operations are messy or inefficient") {
      return (
        <>
          <Shell
            title="What takes up most of your time, and where do things feel inefficient?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "Admin or organisation",
                "Fulfilment or delivery",
                "Customer support",
                "Sales or closing",
                "Everything feels reactive",
              ]}
              onSelect={(value) => setValue("branch1", value, "branch1")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    return (
      <>
        <Shell
          title="Which feels closest to your situation right now?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "We need more customers",
              "We have customers but growth is slow",
              "We are busy but not growing",
              "I do not know what to focus on",
            ]}
            onSelect={(value) => setValue("branch1", value, "branch1")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "branch2") {
    if (answers.constraint === "Not enough leads") {
      return (
        <>
          <Shell
            title="Do you have an audience you can reach directly, and roughly how large is it?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "No audience",
                "Small under 500",
                "Growing 500 to 2000",
                "Established 2000 to 10000",
                "Large 10000 plus",
              ]}
              onSelect={(value) => setValue("branch2", value, "branch2")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    if (answers.constraint === "Leads but not converting") {
      return (
        <>
          <Shell
            title="Where do leads usually drop off or lose interest?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={[
                "Website or landing page",
                "Sales call",
                "Checkout",
                "Follow up stage",
                "Not sure",
              ]}
              onSelect={(value) => setValue("branch2", value, "branch2")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    if (answers.constraint === "Customers not coming back") {
      return (
        <>
          <Shell
            title="Do customers come back or refer others?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={["Frequently", "Sometimes", "Rarely", "Never", "Not sure"]}
              onSelect={(value) => setValue("branch2", value, "branch2")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    return (
      <>
        <Shell
          title="If you stepped away for a week, what would break first?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <TextInputScreen
            value={answers.branch2}
            onChange={(value) => setAnswers((prev) => ({ ...prev, branch2: value }))}
            onContinue={() => nextFrom("branch2")}
            placeholder="Write the first thing that would start slipping or breaking"
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "branch3") {
    if (answers.constraint === "Not enough leads") {
      return (
        <>
          <Shell
            title="If you stopped marketing today, how long would new customers still come in?"
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
          >
            <OptionButtons
              options={["They would not", "A few days", "A few weeks", "Consistently"]}
              onSelect={(value) => setValue("branch3", value, "branch3")}
            />
          </Shell>
          <Styles />
        </>
      );
    }

    return (
      <>
        <Shell
          title="What usually stops someone from buying?"
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <OptionButtons
            options={[
              "Price",
              "Lack of urgency",
              "Lack of trust",
              "Confusion about the offer",
              "Weak follow up",
              "Not sure",
            ]}
            onSelect={(value) => setValue("branch3", value, "branch3")}
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "q9") {
    return (
      <>
        <Shell
          title="What do you sell, how is it priced, and why do customers choose you?"
          subtitle="A short answer is enough."
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <TextInputScreen
            value={answers.offer}
            onChange={(value) => setAnswers((prev) => ({ ...prev, offer: value }))}
            onContinue={() => nextFrom("q9")}
            placeholder="For example, we provide managed bookkeeping for small businesses on a monthly retainer because clients want reliable support without hiring in house"
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "q10") {
    return (
      <>
        <Shell
          title="What have you already tried, and what would you fix first in the next 30 days?"
          subtitle="This helps avoid generic advice and focus on the right next move."
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
        >
          <TextInputScreen
            value={answers.priority}
            onChange={(value) => setAnswers((prev) => ({ ...prev, priority: value }))}
            onContinue={() => nextFrom("q10")}
            placeholder="For example, we tried paid ads and some outreach. If I could fix one thing first it would be getting more qualified leads each month"
            buttonLabel="Analyse my business"
          />
        </Shell>
        <Styles />
      </>
    );
  }

  if (screen === "loading") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="loading-card fade-in" style={{ textAlign: "center" }}>
              <div className="spinner" />
              <h1>Analysing your business</h1>
              <p>Finding the clearest opportunity based on how your business works right now.</p>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  if (screen === "result") {
    return (
      <>
        <div className="app-shell">
          <div className="results-wrap fade-in">
            <div className="results-grid">
              <div className="insight-card">
                <div className="insight-label">Your first insight</div>
                <h1 className="results-title">Here is your biggest opportunity right now</h1>
                <div className="insight-panel">
                  <h2>{insight.title}</h2>
                  <p>{insight.text}</p>
                </div>
              </div>

              <div>
                <div className="locked-card">
                  <div className="locked-title">4 more tailored insights waiting</div>
                  <div className="locked-item">
                    <span>A second insight tied directly to the answers you gave</span>
                  </div>
                  <div className="locked-item">
                    <span>A practical improvement you can act on this week</span>
                  </div>
                  <div className="locked-item">
                    <span>A missed opportunity many businesses at your stage overlook</span>
                  </div>
                  <div className="locked-item">
                    <span>A clearer next move based on what you said you already tried</span>
                  </div>
                </div>

                <div className="upsell-card">
                  <div className="upsell-small">Unlock the full plan</div>
                  <h3>Get 4 more insights tailored to your business for £9</h3>
                  <p>Clear actions. No fluff. Built directly from your answers.</p>
                  <button className="primary-button" onClick={() => setScreen("paywall")}>
                    Unlock full plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  if (screen === "paywall") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="pay-card fade-in">
              <h1>You are one step away from your full growth plan</h1>
              <p>
                Unlock the remaining insights and get a clearer view of what to fix next, where the
                opportunity is, and how to move forward with more confidence.
              </p>
              <div className="feature-list" style={{ marginTop: 24 }}>
  <div className="feature-item">
    <p>4 additional insights tailored to your business</p>
  </div>
  <div className="feature-item">
    <p>Clear actions you can implement immediately</p>
  </div>
  <div className="feature-item">
    <p>Written to match your business model and stage</p>
  </div>
</div>
              <div style={{ marginTop: 24 }}>
                <div className="small-label">Email for delivery</div>
                <input
                  className="input-field"
                  value={answers.email}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="name@business.com"
                />
              </div>
              <div className="button-row" style={{ marginTop: 28 }}>
                <button
                  className="primary-button"
                  disabled={!answers.email.trim()}
                  onClick={() => setScreen("fullPlan")}
                >
                  Pay £9 and unlock
                </button>
                <button className="secondary-button" onClick={() => setScreen("result")}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <div className="plan-wrap fade-in">
          <div className="plan-head">
            <div>
              <div className="pill">Full plan unlocked</div>
              <h1>Your tailored growth plan</h1>
              <p>
                These insights are based on the answers you gave and are designed to help you focus
                on the most important next moves.
              </p>
            </div>
            <button className="primary-button">Generate 30 day plan</button>
          </div>

          <div className="plan-list">
            <div className="plan-card">
              <div className="small-label">Insight 1</div>
              <h2>{insight.title}</h2>
              <p>{insight.text}</p>
            </div>

            <div className="plan-card">
              <div className="small-label">Insight 2</div>
              <h2>There is likely one bottleneck you are underweighting</h2>
              <p>
                Based on your answers, one part of the business is carrying more pressure than it
                should. Instead of trying to improve everything, narrow your focus to the step that
                directly affects revenue movement. That is where your next gains are most likely to
                come from.
              </p>
            </div>

            <div className="plan-card">
              <div className="small-label">Insight 3</div>
              <h2>Your current approach needs more structure, not more effort</h2>
              <p>
                The pattern in your answers suggests you may be relying too much on manual judgment
                or inconsistent habits. Cleaner process beats more hustle here. Put one repeatable
                workflow in place and measure whether it improves response time, conversion, or
                retention.
              </p>
            </div>

            <div className="plan-card">
              <div className="small-label">Insight 4</div>
              <h2>You should fix the nearest revenue lever before expanding</h2>
              <p>
                The right next move is not necessarily more activity. It is strengthening the
                revenue lever closest to the money. That could mean lead response, sales process,
                follow up, reactivation, or offer clarity. Improve the closest broken step first,
                then scale from there.
              </p>
            </div>

            <div className="plan-card">
              <div className="small-label">Insight 5</div>
              <h2>Your next 30 days should be focused, not scattered</h2>
              <p>
                You will get better results by choosing one measurable priority and building around
                it. Use the next month to commit to one operational improvement, one growth
                improvement, and one piece of simple tracking so you can see whether progress is
                actually happening.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Styles />
    </>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        background: #f5f5f2;
        color: #111111;
      }

      body {
        min-height: 100vh;
      }

      .app-shell {
        min-height: 100vh;
        background: #f5f5f2;
      }

      .container {
        width: 100%;
        max-width: 1160px;
        margin: 0 auto;
        padding: 32px 20px;
      }

      .container.narrow {
        max-width: 820px;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 72px;
        align-items: center;
        min-height: 100vh;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        border: 1px solid #e6e6e1;
        background: #ffffff;
        color: #5f5f57;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 13px;
        margin-bottom: 18px;
        letter-spacing: 0.02em;
      }

      .hero-title {
        font-size: 58px;
        line-height: 1.02;
        letter-spacing: -0.045em;
        margin: 0;
        max-width: 620px;
      }

      .hero-copy {
        font-size: 19px;
        line-height: 1.75;
        color: #5f5f57;
        max-width: 600px;
        margin-top: 26px;
      }

      .button-row {
        display: flex;
        gap: 12px;
        margin-top: 30px;
        flex-wrap: wrap;
      }

      .primary-button,
      .secondary-button {
        height: 52px;
        border-radius: 18px;
        font-size: 15px;
        padding: 0 22px;
        cursor: pointer;
        transition: 0.2s ease;
        font-weight: 500;
      }

      .primary-button {
        border: 0;
        background: #111111;
        color: #ffffff;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }

      .primary-button:hover {
        background: #1e1e1e;
        transform: translateY(-1px);
      }

      .primary-button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .secondary-button {
        border: 1px solid #e3e3dc;
        background: #ffffff;
        color: #111111;
        opacity: 0.85;
      }

      .secondary-button:hover {
        background: #fafafa;
      }

      .meta-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 22px;
      }

      .meta-pill {
        border: 1px solid #e7e7e1;
        background: #fbfbf8;
        color: #6a6a63;
        border-radius: 999px;
        padding: 9px 12px;
        font-size: 13px;
        line-height: 1;
      }

      .panel {
        background: #fbfbf8;
        border: 1px solid #ecece6;
        border-radius: 28px;
        box-shadow: 0 12px 40px rgba(22, 22, 18, 0.04);
      }

      .big-panel {
        padding: 32px;
      }

      .small-label {
        font-size: 14px;
        color: #6c6c64;
        margin-bottom: 16px;
      }

      .feature-list {
        display: grid;
        gap: 14px;
      }

      .feature-item {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        padding: 18px;
        border-radius: 18px;
        border: 1px solid #ecece6;
        background: #ffffff;
      }

      .feature-item p {
        margin: 0;
        font-size: 15px;
        line-height: 1.8;
        color: #41413b;
      }

      .feature-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #3b3b36;
        margin-top: 10px;
        flex: none;
        opacity: 0.75;
      }

      .progress-wrap {
        padding-top: 14px;
      }

      .progress-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #6c6c64;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .progress-bar {
        width: 100%;
        height: 9px;
        background: #e6e6e1;
        border-radius: 999px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: #111111;
        border-radius: 999px;
        transition: width 0.25s ease;
      }

      .question-card {
        margin-top: 34px;
        background: #ffffff;
        border: 1px solid #e6e6e1;
        border-radius: 28px;
        padding: 34px;
        box-shadow: 0 18px 60px rgba(22, 22, 18, 0.06);
      }

      .question-title {
        margin: 0;
        font-size: 42px;
        line-height: 1.1;
        letter-spacing: -0.03em;
      }

      .question-subtitle {
        margin: 16px 0 0;
        color: #66665e;
        font-size: 17px;
        line-height: 1.8;
        max-width: 680px;
      }

      .stack {
        display: grid;
        gap: 12px;
        margin-top: 28px;
      }

      .option-button {
        width: 100%;
        text-align: left;
        border: 1px solid #e3e3dc;
        background: #ffffff;
        color: #121212;
        border-radius: 22px;
        padding: 18px 18px;
        font-size: 15px;
        line-height: 1.6;
        cursor: pointer;
        transition: 0.18s ease;
      }

      .option-button:hover {
        border-color: #111111;
        box-shadow: 0 10px 28px rgba(17, 17, 17, 0.06);
        transform: translateY(-1px);
      }

      .text-area {
        width: 100%;
        min-height: 170px;
        border: 1px solid #e3e3dc;
        background: #ffffff;
        color: #111111;
        border-radius: 22px;
        padding: 18px;
        font-size: 15px;
        line-height: 1.7;
        resize: vertical;
        outline: none;
      }

      .text-area:focus {
        border-color: #111111;
      }

      .fade-in {
        animation: fadeIn 0.24s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .center-wrap {
        max-width: 820px;
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        align-items: center;
        padding: 32px 20px;
      }

      .intro-card,
      .loading-card,
      .pay-card {
        width: 100%;
        background: #ffffff;
        border: 1px solid #e6e6e1;
        border-radius: 28px;
        padding: 36px;
        box-shadow: 0 18px 60px rgba(22, 22, 18, 0.06);
      }

      .intro-card h1,
      .loading-card h1,
      .pay-card h1 {
        font-size: 46px;
        line-height: 1.06;
        letter-spacing: -0.04em;
        margin: 0;
      }

      .intro-card p,
      .loading-card p,
      .pay-card p {
        margin: 18px 0 0;
        font-size: 17px;
        line-height: 1.9;
        color: #66665e;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 4px solid #e6e6e1;
        border-top-color: #111111;
        animation: spin 0.9s linear infinite;
        margin: 0 auto 22px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .results-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 28px;
      }

      .results-wrap {
        max-width: 1160px;
        margin: 0 auto;
        padding: 36px 20px;
      }

      .insight-card,
      .locked-card,
      .upsell-card,
      .plan-card {
        background: #ffffff;
        border: 1px solid #e6e6e1;
        border-radius: 28px;
        box-shadow: 0 18px 60px rgba(22, 22, 18, 0.06);
      }

      .insight-card {
        padding: 34px;
      }

      .insight-label {
        display: inline-flex;
        align-items: center;
        border: 1px solid #e6e6e1;
        background: #fafaf7;
        color: #6c6c64;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 14px;
      }

      .results-title {
        font-size: 48px;
        line-height: 1.08;
        letter-spacing: -0.04em;
        margin: 18px 0 0;
        max-width: 720px;
      }

      .insight-panel {
        margin-top: 26px;
        background: #fafaf7;
        border: 1px solid #ecece6;
        border-radius: 24px;
        padding: 24px;
      }

      .insight-panel h2 {
        margin: 0;
        font-size: 30px;
        line-height: 1.15;
        letter-spacing: -0.03em;
      }

      .insight-panel p {
        margin: 16px 0 0;
        font-size: 17px;
        line-height: 1.9;
        color: #43433d;
      }

      .locked-card {
        padding: 24px;
      }

      .locked-title {
        font-size: 14px;
        color: #6c6c64;
        margin-bottom: 14px;
      }

      .locked-item {
        overflow: hidden;
        border: 1px solid #e8e8e2;
        background: #fafaf7;
        border-radius: 20px;
        padding: 16px;
        margin-bottom: 10px;
      }

      .locked-item span {
        display: block;
        font-size: 15px;
        line-height: 1.7;
        color: #66665e;
        filter: blur(3px);
        user-select: none;
      }

      .upsell-card {
        margin-top: 16px;
        padding: 24px;
        background: #111111;
        color: #ffffff;
      }

      .upsell-small {
        color: #b6b6ae;
        font-size: 14px;
      }

      .upsell-card h3 {
        font-size: 28px;
        line-height: 1.15;
        letter-spacing: -0.03em;
        margin: 12px 0 0;
      }

      .upsell-card p {
        margin: 14px 0 0;
        color: #c9c9c1;
        font-size: 15px;
        line-height: 1.8;
      }

      .upsell-card .primary-button {
        width: 100%;
        margin-top: 18px;
        background: #ffffff;
        color: #111111;
      }

      .input-field {
        width: 100%;
        height: 50px;
        border: 1px solid #e3e3dc;
        border-radius: 18px;
        padding: 0 16px;
        font-size: 15px;
        outline: none;
        margin-top: 10px;
      }

      .input-field:focus {
        border-color: #111111;
      }

      .plan-wrap {
        max-width: 1020px;
        margin: 0 auto;
        padding: 36px 20px;
      }

      .plan-head {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 20px;
        flex-wrap: wrap;
      }

      .plan-head h1 {
        margin: 14px 0 0;
        font-size: 48px;
        line-height: 1.06;
        letter-spacing: -0.04em;
      }

      .plan-head p {
        margin: 14px 0 0;
        font-size: 17px;
        line-height: 1.9;
        color: #66665e;
        max-width: 720px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid #e6e6e1;
        background: #ffffff;
        color: #6c6c64;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 14px;
      }

      .plan-list {
        display: grid;
        gap: 18px;
        margin-top: 24px;
      }

      .plan-card {
        padding: 28px;
      }

      .plan-card .small-label {
        margin-bottom: 10px;
      }

      .plan-card h2 {
        margin: 0;
        font-size: 29px;
        line-height: 1.18;
        letter-spacing: -0.03em;
      }

      .plan-card p {
        margin: 14px 0 0;
        font-size: 16px;
        line-height: 1.9;
        color: #43433d;
      }

      @media (max-width: 980px) {
        .hero-grid,
        .results-grid {
          grid-template-columns: 1fr;
        }

        .hero-title,
        .results-title,
        .plan-head h1,
        .intro-card h1,
        .loading-card h1,
        .pay-card h1 {
          font-size: 40px;
        }

        .question-title {
          font-size: 34px;
        }
      }

      @media (max-width: 640px) {
        .container,
        .results-wrap,
        .plan-wrap,
        .center-wrap {
          padding-left: 16px;
          padding-right: 16px;
        }

        .hero-title,
        .results-title,
        .plan-head h1,
        .intro-card h1,
        .loading-card h1,
        .pay-card h1 {
          font-size: 34px;
        }

        .question-card,
        .intro-card,
        .loading-card,
        .pay-card,
        .insight-card,
        .locked-card,
        .upsell-card,
        .plan-card,
        .big-panel {
          padding: 22px;
        }

        .question-title {
          font-size: 30px;
        }
      }
    `}</style>
  );
}