import { useEffect, useState } from "react";
import "./problem1.scss";

function summation(n) {
    if (n === 0) return "0";

    const start = n > 0 ? 1 : n;
    const end = n > 0 ? n : -1;
    const values = [];
    for (let i = start; i <= end; i++) values.push(i);

    if (values.length > 12) {
        return `${values[0]} + ${values[1]} + ${values[2]} + … + ${values[values.length - 1]}`;
    }

    return values.join(" + ");
}

export function Problem1() {
    const [raw, setRaw] = useState("5");
    const [n, setN] = useState(5);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Problem 1 · sum_to_n";
    }, []);

    function onSubmit(event) {
        event.preventDefault();
        const value = Number(raw);
        if (raw.trim() === "" || !Number.isInteger(value)) {
            setError("Enter an integer.");
            return;
        }
        setError("");
        setN(value);
    }

    // mathematical formula
    var sum_to_n_a = function (n) {
        const abs = Math.abs(n);
        const sum = abs * ((abs + 1) / 2);
        return n < 0 ? -sum : sum;
    };

    // loop through the numbers from 1 to |n| and add them up
    var sum_to_n_b = function (n) {
        const abs = Math.abs(n);
        let sum = 0;

        for (let i = 1; i <= abs; i++) {
            sum += i;
        }

        return n < 0 ? -sum : sum;
    };

    // recursion
    var sum_to_n_c = function (n) {
        if (n === 0) {
            return 0;
        }

        if (n < 0) {
            return n + sum_to_n_c(n + 1);
        }

        return n + sum_to_n_c(n - 1);
    };

    const series = summation(n);

    return (
        <main className="sheet">
            <section className="card">
                <header className="card-heading">
                    <h1>Sum to n</h1>
                    <p>Sum the integers from 1 through n.</p>
                </header>
                <form onSubmit={onSubmit}>
                    <div className={`field ${error ? "invalid" : ""}`}>
                        <div className="field-label">
                            <label htmlFor="sum-n">Input:</label>
                        </div>
                        <input
                            id="sum-n"
                            className="amount"
                            value={raw}
                            type="number"
                            inputMode="numeric"
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "sum-error" : undefined}
                            onChange={(event) => {
                                setRaw(event.target.value);
                                setError("");
                            }}
                        />
                    </div>
                    {error ? (
                        <p
                            id="sum-error"
                            className="form-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    ) : null}
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Calculate
                    </button>
                </form>

                <div className="field sum-results">
                    <div className="field-label">Output:</div>
                    <ul className="sum-results-list">
                        <li>
                            <code>sum_to_n_a({n})</code>
                            <span>
                                {series} === {sum_to_n_a(n)}
                            </span>
                        </li>
                        <li>
                            <code>sum_to_n_b({n})</code>
                            <span>
                                {series} === {sum_to_n_b(n)}
                            </span>
                        </li>
                        <li>
                            <code>sum_to_n_c({n})</code>
                            <span>
                                {series} === {sum_to_n_c(n)}
                            </span>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
}
