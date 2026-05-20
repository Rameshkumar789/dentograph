'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  CheckCircle2,
  FolderOpen,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Save,
  UserPen,
  UserRound,
} from 'lucide-react';
import PatientPortalShell from '@/components/PatientPortalShell';
import styles from './profile.module.css';

type MedicalHistory = {
  insurance?: { provider?: string; member_id?: string; group_id?: string; plan_type?: string; phone?: string };
  emergency_contact?: { name?: string; relationship?: string; phone?: string };
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  preferred_dentist?: { clinic?: string; dentist?: string; phone?: string };
};

export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    blood_type: '',
    insurance_provider: '',
    insurance_member_id: '',
    insurance_group_id: '',
    insurance_plan_type: '',
    insurance_phone: '',
    emergency_name: '',
    emergency_relationship: '',
    emergency_phone: '',
    allergies: '',
    conditions: '',
    medications: '',
    preferred_clinic: '',
    preferred_dentist: '',
    preferred_phone: '',
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const [{ data: profile }, { data: patient }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('patients').select('date_of_birth, gender, blood_type, medical_history').eq('id', user.id).single(),
      ]);

      const history = (patient?.medical_history || {}) as MedicalHistory;
      setForm({
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || '',
        blood_type: patient?.blood_type || '',
        insurance_provider: history.insurance?.provider || '',
        insurance_member_id: history.insurance?.member_id || '',
        insurance_group_id: history.insurance?.group_id || '',
        insurance_plan_type: history.insurance?.plan_type || '',
        insurance_phone: history.insurance?.phone || '',
        emergency_name: history.emergency_contact?.name || '',
        emergency_relationship: history.emergency_contact?.relationship || '',
        emergency_phone: history.emergency_contact?.phone || '',
        allergies: (history.allergies || []).join(', '),
        conditions: (history.conditions || []).join(', '),
        medications: (history.medications || []).join(', '),
        preferred_clinic: history.preferred_dentist?.clinic || '',
        preferred_dentist: history.preferred_dentist?.dentist || '',
        preferred_phone: history.preferred_dentist?.phone || '',
      });
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  const age = useMemo(() => {
    if (!form.date_of_birth) return '';
    const dob = new Date(form.date_of_birth);
    const today = new Date();
    let value = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) value -= 1;
    return Number.isFinite(value) ? `${value} years old` : '';
  }, [form.date_of_birth]);

  const completion = useMemo(() => {
    const checks = [
      form.full_name,
      form.date_of_birth,
      form.blood_type,
      form.insurance_provider,
      form.emergency_name,
      form.preferred_clinic,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  function list(value: string) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    const medical_history: MedicalHistory = {
      insurance: {
        provider: form.insurance_provider,
        member_id: form.insurance_member_id,
        group_id: form.insurance_group_id,
        plan_type: form.insurance_plan_type,
        phone: form.insurance_phone,
      },
      emergency_contact: {
        name: form.emergency_name,
        relationship: form.emergency_relationship,
        phone: form.emergency_phone,
      },
      allergies: list(form.allergies),
      conditions: list(form.conditions),
      medications: list(form.medications),
      preferred_dentist: {
        clinic: form.preferred_clinic,
        dentist: form.preferred_dentist,
        phone: form.preferred_phone,
      },
    };

    const [{ error: profileError }, { error: patientError }] = await Promise.all([
      supabase.from('profiles').update({ full_name: form.full_name }).eq('id', userId),
      supabase.from('patients').upsert({
        id: userId,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        blood_type: form.blood_type || null,
        medical_history,
        updated_at: new Date().toISOString(),
      }),
    ]);

    if (profileError || patientError) {
      setError(profileError?.message || patientError?.message || 'Unable to save profile');
      setSaving(false);
      return;
    }

    await supabase.from('audit_logs').insert({
      actor_id: userId,
      action: 'update_patient_profile',
      entity_id: userId,
      entity_type: 'patient_profile',
    });

    setSaving(false);
    setSaved(true);
  }

  if (loading) {
    return (
      <PatientPortalShell active="Profile">
        <div className={styles.loading}>Loading profile...</div>
      </PatientPortalShell>
    );
  }

  return (
    <PatientPortalShell active="Profile">
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Patient profile</p>
            <h1>Profile</h1>
            <p>Keep contact, insurance, and health details ready for record sharing.</p>
          </div>
        </header>

        <form className={styles.form} onSubmit={saveProfile}>
          <section className={styles.profileHero}>
            <div className={styles.avatar}><UserRound size={34} /></div>
            <div>
              <h2>{form.full_name || 'Patient'}</h2>
              <p>{age || 'Add your date of birth to complete your profile.'}</p>
            </div>
            <div className={styles.completionCard}>
              <div>
                <span>Profile complete</span>
                <strong>{completion}%</strong>
              </div>
              <div className={styles.progressTrack}><span style={{ width: `${completion}%` }} /></div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <UserPen size={20} />
              <div>
                <h2>About you</h2>
                <p>Basic details that help identify your records.</p>
              </div>
            </div>
            <div className={styles.grid}>
              <Field label="Full name" name="full_name" value={form.full_name} onChange={update} />
              <Field label="Date of birth" name="date_of_birth" value={form.date_of_birth} onChange={update} type="date" hint={age} />
              <Field label="Gender" name="gender" value={form.gender} onChange={update} />
              <Field label="Blood type" name="blood_type" value={form.blood_type} onChange={update} placeholder="e.g. O+" />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <ShieldCheck size={20} />
              <div>
                <h2>Insurance</h2>
                <p>Optional details you may want available during a dental visit.</p>
              </div>
            </div>
            <div className={styles.grid}>
              <Field label="Insurance provider" name="insurance_provider" value={form.insurance_provider} onChange={update} />
              <Field label="Member ID" name="insurance_member_id" value={form.insurance_member_id} onChange={update} />
              <Field label="Group ID" name="insurance_group_id" value={form.insurance_group_id} onChange={update} />
              <Field label="Plan type" name="insurance_plan_type" value={form.insurance_plan_type} onChange={update} placeholder="PPO, HMO, Medicaid..." />
              <Field label="Insurance phone" name="insurance_phone" value={form.insurance_phone} onChange={update} />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <HeartPulse size={20} />
              <div>
                <h2>Health and emergency</h2>
                <p>Information a care team may need before treatment.</p>
              </div>
            </div>
            <div className={styles.grid}>
              <Field label="Emergency contact" name="emergency_name" value={form.emergency_name} onChange={update} />
              <Field label="Relationship" name="emergency_relationship" value={form.emergency_relationship} onChange={update} />
              <Field label="Emergency phone" name="emergency_phone" value={form.emergency_phone} onChange={update} />
              <Field label="Allergies" name="allergies" value={form.allergies} onChange={update} placeholder="Separate with commas" />
              <Field label="Conditions" name="conditions" value={form.conditions} onChange={update} placeholder="Separate with commas" />
              <Field label="Medications" name="medications" value={form.medications} onChange={update} placeholder="Separate with commas" />
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <FolderOpen size={20} />
              <div>
                <h2>Preferred dental office</h2>
                <p>The clinic you most often use or want records connected to.</p>
              </div>
            </div>
            <div className={styles.grid}>
              <Field label="Clinic name" name="preferred_clinic" value={form.preferred_clinic} onChange={update} />
              <Field label="Dentist name" name="preferred_dentist" value={form.preferred_dentist} onChange={update} />
              <Field label="Clinic phone" name="preferred_phone" value={form.preferred_phone} onChange={update} />
            </div>
          </section>

          <div className={styles.saveBar}>
            <div className={styles.saveStatus}>
              {error && <span className={styles.error}>{error}</span>}
              {saved && <span className={styles.saved}><CheckCircle2 size={16} /> Changes saved</span>}
              {!error && !saved && <span>Update your profile, then save changes.</span>}
            </div>
            <button type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className={styles.spin} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </main>
    </PatientPortalShell>
  );
}

function Field({ label, name, value, onChange, type = 'text', placeholder, hint }: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(name, event.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}
