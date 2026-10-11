// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: null,
}));

const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<div>panel ok</div>} />
        </Route>
        <Route path="/admin/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirige a /admin/login sin sesion", async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });
    renderRoute();
    expect(await screen.findByText("login page")).toBeDefined();
  });

  it("bloquea usuario con sesion pero sin claim admin", async () => {
    mockedUseAuth.mockReturnValue({
      user: { uid: "u1" },
      loading: false,
      isAdmin: false,
    });
    renderRoute();
    expect(await screen.findByText("Sin permisos")).toBeDefined();
  });

  it("deja pasar a admin con claim", async () => {
    mockedUseAuth.mockReturnValue({
      user: { uid: "a1" },
      loading: false,
      isAdmin: true,
    });
    renderRoute();
    expect(await screen.findByText("panel ok")).toBeDefined();
  });
});
