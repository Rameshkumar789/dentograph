'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileImage } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import styles from './source.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  file_path?: string;
}

export default function SourceDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DentalRecord | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(data);

      if (data?.file_path) {
        const paths = data.file_path.split(',').filter(Boolean);
        const urls = await Promise.all(paths.map(async (path: string) => {
          const { data: signedData } = await supabase.storage.from('dental-records').createSignedUrl(path, 3600);
          return signedData?.signedUrl || '';
        }));
        setImageUrls(urls.filter(Boolean));
      }

      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  if (loading) {
    return <main className={styles.loading}>Loading source files...</main>;
  }

  if (!record) {
    return <main className={styles.loading}>Record not found.</main>;
  }

  const date = new Date(record.visit_date || record.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href={`/records/${id}`} className={styles.backLink}><ArrowLeft size={17} /> Back to record</Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Original documents</p>
            <h1>{record.clinic_name || record.dentist_name || 'Source files'}</h1>
            <p>These are the original files uploaded for this visit. DentoGraph uses these files to create the visual record and plain-language summary.</p>
          </div>
          <div className={styles.meta}>
            <span>{date}</span>
            <span>{record.record_type}</span>
            <span>{imageUrls.length} file{imageUrls.length === 1 ? '' : 's'}</span>
          </div>
        </section>

        {imageUrls.length === 0 ? (
          <section className={styles.empty}>
            <FileImage size={28} />
            <h2>No source files found</h2>
            <p>This record does not have retrievable source files attached.</p>
          </section>
        ) : (
          <section className={styles.files}>
            {imageUrls.map((url, index) => (
              <article key={url} className={styles.fileCard}>
                <header>
                  <strong>Original file {index + 1}</strong>
                  <span>Read-only preview</span>
                </header>
                <div className={styles.preview}>
                  <img src={url} alt={`Original dental document ${index + 1}`} />
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
