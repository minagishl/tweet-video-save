'use client';

import React, { useState } from 'react';
import checkUrl from '@/utils/checkUrl';
import toID from '@/utils/toID';

// Components
import Container from '@/components/container';
import Button from '@/components/button';
import Input from '@/components/input';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!checkUrl(url)) {
      alert('Invalid URL');
      return;
    }

    const id = toID(url);

    try {
      const response = await fetch(`/api/tweet?id=${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVideoUrls([]);

      data.photos?.map((photo: any) => {
        setVideoUrls((prev) => [...prev, photo.url]);
      });

      if (data.video?.variants) {
        const variants = data.video.variants.reverse();
        setVideoUrls((prev) => [...prev, variants[0].src]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch tweet data');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onEnter = () => {
    return null;
  };

  const clearUrl = () => {
    setUrl('');
  };

  const downloadAll = () => {
    videoUrls.map((videoUrl) => {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = videoUrl.split('/').pop() ?? 'download';
      link.click();
    });
  };

  return (
    <Container>
      <form
        className="flex w-full max-w-md flex-col space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="relative mb-3 flex w-full">
          <Input
            url={url}
            placeholder="Enter the url"
            className="relative w-full"
            onChange={onChange}
            onEnter={onEnter}
            clearUrl={clearUrl}
          />
        </div>

        <Button type="submit" color="primary" font="medium">
          Get Video & Image
        </Button>

        {videoUrls.length > 0 && (
          <Button
            type="button"
            color="secondary"
            font="medium"
            onClick={downloadAll}
          >
            Download All
          </Button>
        )}

        <span className="flex items-center justify-center px-2 text-sm font-medium text-gray-600 dark:text-neutral-400">
          You can use it for personal use only.
        </span>

        {videoUrls.length > 0 && (
          <textarea
            value={videoUrls.join('\n')}
            readOnly={true}
            className="block h-fit w-full resize-none rounded-lg border-gray-200 p-4 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          />
        )}
      </form>
    </Container>
  );
}
