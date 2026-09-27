import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/_betterauth/auth-client";
import { Button } from "~/_shadcn/component/interface/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_shadcn/component/interface/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/_shadcn/component/interface/field";
import { Input } from "~/_shadcn/component/interface/input";

export function LoginForm() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const isEmail = identifier.includes("@");
    const result = isEmail
      ? await authClient.signIn.email({ email: identifier, password })
      : await authClient.signIn.username({ username: identifier, password });
    setLoading(false);

    if (result.error) {
      toast.error(result.error.message ?? "Unable to sign in.");
      return;
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in with your username (or email) and password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="identifier">Username or email</FieldLabel>
              <Input
                id="identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                autoFocus
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Register
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
