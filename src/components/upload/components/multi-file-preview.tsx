import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { styled, SxProps, Theme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from '../../../utils/format-number';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';
import { getFileMeta, FileThumbnail, useFilesPreview } from '../../file-thumbnail';

// ----------------------------------------------------------------------

interface StyledProps {
  orientation?: 'horizontal' | 'vertical';
}

interface MultiFilePreviewProps {
  sx?: SxProps<Theme>;
  className?: string;
  files?: (File | string)[];
  orientation?: 'horizontal' | 'vertical';
  thumbnail?: React.ComponentProps<typeof FileThumbnail>;
  onRemove?: (file: File | string) => void;
  startNode?: React.ReactNode;
  endNode?: React.ReactNode;
  [key: string]: any;
}

export function MultiFilePreview({
  sx,
  onRemove,
  className,
  endNode,
  startNode,
  files = [],
  orientation = 'horizontal',
  thumbnail: thumbnailProps,
  ...other
}: MultiFilePreviewProps) {
  const { filesPreview } = useFilesPreview(files);

  const renderList = () =>
    filesPreview.map(({ file, previewUrl }) => {
      const fileMeta = getFileMeta(file);
      const itemKey = fileMeta.key || (typeof file === 'string' ? file : file.name);

      const commonProps = {
        file,
        previewUrl,
        ...thumbnailProps,
      };

      if (orientation === 'horizontal') {
        return (
          <PreviewItem key={itemKey} orientation="horizontal">
            <FileThumbnail
              tooltip
              showImage
              onRemove={() => onRemove?.(file)}
              {...commonProps}
              sx={[
                (theme) => ({
                  width: 80,
                  height: 80,
                  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }),
                ...(Array.isArray(thumbnailProps?.sx) ? thumbnailProps.sx : [thumbnailProps?.sx]),
              ]}
              slotProps={{
                icon: { sx: { width: 36, height: 36 } },
                ...thumbnailProps?.slotProps,
              }}
            />
          </PreviewItem>
        );
      }

      return (
        <PreviewItem key={fileMeta.key} orientation="vertical">
          <FileThumbnail {...commonProps} />

          <ListItemText
            primary={fileMeta.name}
            secondary={fileMeta.size ? fData(fileMeta.size) : ''}
            slotProps={{
              secondary: { sx: { typography: 'caption' } },
            }}
          />

          {onRemove && (
            <IconButton size="small" onClick={() => onRemove(file)}>
              <Iconify width={16} icon="mingcute:close-line" />
            </IconButton>
          )}
        </PreviewItem>
      );
    });

  return (
    <PreviewList
      orientation={orientation}
      className={mergeClasses([uploadClasses.preview.multi, className])}
      sx={sx}
      {...other}
    >
      {startNode && <SlotNode orientation={orientation}>{startNode}</SlotNode>}
      {renderList()}
      {endNode && <SlotNode orientation={orientation}>{endNode}</SlotNode>}
    </PreviewList>
  );
}

// ----------------------------------------------------------------------

export const PreviewList = styled('ul', {
  shouldForwardProp: (prop) => !['orientation', 'sx'].includes(prop as string),
})<StyledProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  variants: [
    {
      props: (props) => props.orientation === 'horizontal',
      style: {
        flexWrap: 'wrap',
        flexDirection: 'row',
      },
    },
  ],
}));

const PreviewItem = styled('li', {
  shouldForwardProp: (prop) => !['orientation', 'sx'].includes(prop as string),
})<StyledProps>({
  display: 'inline-flex',
  variants: [
    {
      props: (props) => props.orientation === 'vertical',
      style: ({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        padding: theme.spacing(1, 1, 1, 1.5),
        borderRadius: theme.shape.borderRadius,
        border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
      }),
    },
  ],
});

const SlotNode = styled('li', {
  shouldForwardProp: (prop) => !['orientation', 'sx'].includes(prop as string),
})<StyledProps>({
  variants: [
    {
      props: (props) => props.orientation === 'horizontal',
      style: {
        width: 'auto',
        display: 'inline-flex',
      },
    },
  ],
});
